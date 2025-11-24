import * as XLSX from 'xlsx';
import { ClientDetails, Room, BrandingSettings, Currency, CURRENCIES, BoqItem } from '../types';
import { companyTemplate } from '../data/scopeAndTermsData';
import { getExchangeRates } from './currency';

const createStyledCell = (value: any, style: any, type: 's' | 'n' | 'b' | 'd' = 's') => {
    return { t: type, v: value, s: style };
};

export const exportToXlsx = async (
    rooms: Room[],
    clientDetails: ClientDetails,
    margin: number,
    branding: BrandingSettings,
    selectedCurrency: Currency,
) => {
    const wb = XLSX.utils.book_new();
    const usedSheetNames = new Set<string>();

    const headerStyle = {
        fill: { fgColor: { rgb: branding.primaryColor.replace('#', 'FF') } },
        font: { color: { rgb: "FFFFFFFF" }, bold: true, sz: 11 },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
            top: { style: 'thin', color: { auto: 1 } },
            bottom: { style: 'thin', color: { auto: 1 } },
            left: { style: 'thin', color: { auto: 1 } },
            right: { style: 'thin', color: { auto: 1 } },
        }
    };

    const sectionHeaderStyle = {
        font: { bold: true, sz: 12, color: { rgb: "FF000000" } },
        fill: { fgColor: { rgb: "FFD9D9D9" } } // Light Grey
    };
    
    const labelStyle = { font: { bold: true } };
    const totalStyle = { font: { bold: true }, alignment: { horizontal: 'right' } };

    const getUniqueSheetName = (baseName: string): string => {
        const sanitizedBaseName = baseName.replace(/[\\/?*[\]]/g, '');
        let name = sanitizedBaseName.substring(0, 31);
        if (!usedSheetNames.has(name)) {
            usedSheetNames.add(name);
            return name;
        }
        let i = 2;
        while (true) {
            const suffix = ` (${i})`;
            const truncatedName = sanitizedBaseName.substring(0, 31 - suffix.length);
            name = `${truncatedName}${suffix}`;
            if (!usedSheetNames.has(name)) {
                usedSheetNames.add(name);
                return name;
            }
            i++;
        }
    };

    const currencyInfo = CURRENCIES.find(c => c.value === selectedCurrency)!;
    const rates = await getExchangeRates();
    const rate = rates[selectedCurrency] || 1;
    const gstRate = 0.18;
    const sgstRate = gstRate / 2;
    const cgstRate = gstRate / 2;
    const isINR = selectedCurrency === 'INR';
    
    // --- Cover Page Sheet (Dynamically built) ---
    const coverWsData = [];
    const merges = [];

    // Row 0: Title
    coverWsData.push([createStyledCell('Project Proposal', { font: { sz: 24, bold: true } })]);
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });

    // Row 1: Optional Logo Note
    if (branding.logoUrl) {
        coverWsData.push([createStyledCell(
            '(Your company logo has been saved and will appear on all documents printed from this application.)',
            { font: { italic: true, sz: 9, color: { rgb: "FF808080" } } }
        )]);
        merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } });
    }

    coverWsData.push([]); // Spacer

    // Project Details section
    let currentRow = coverWsData.length;
    coverWsData.push([createStyledCell('Project Details', sectionHeaderStyle)]);
    merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 2 } });
    coverWsData.push(
        [createStyledCell('Project Name:', labelStyle), clientDetails.projectName],
        [createStyledCell('Date:', labelStyle), clientDetails.date],
        [createStyledCell('Location:', labelStyle), clientDetails.location]
    );

    coverWsData.push([]); // Spacer

    // Prepared For section
    currentRow = coverWsData.length;
    coverWsData.push([createStyledCell('Prepared For (Client)', sectionHeaderStyle)]);
    merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 2 } });
    coverWsData.push(
        [createStyledCell('Client Name:', labelStyle), clientDetails.clientName],
        [createStyledCell('Key Contact:', labelStyle), clientDetails.keyClientPersonnel]
    );

    coverWsData.push([]); // Spacer

    // Prepared By section
    currentRow = coverWsData.length;
    coverWsData.push([createStyledCell('Prepared By', sectionHeaderStyle)]);
    merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 2 } });
    coverWsData.push(
        [createStyledCell('Company:', labelStyle), branding.companyInfo.name],
        [createStyledCell('Address:', labelStyle), branding.companyInfo.address],
        [createStyledCell('Phone:', labelStyle), branding.companyInfo.phone],
        [createStyledCell('Email:', labelStyle), branding.companyInfo.email],
        [createStyledCell('Website:', labelStyle), branding.companyInfo.website],
        [createStyledCell('Account Manager:', labelStyle), clientDetails.accountManager],
        [createStyledCell('Design Engineer:', labelStyle), clientDetails.designEngineer]
    );

    const coverWs = XLSX.utils.aoa_to_sheet(coverWsData);
    coverWs["!merges"] = merges;
    coverWs['!cols'] = [{ wch: 20 }, { wch: 50 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, coverWs, 'Cover Page');

    // --- Proposal Summary Sheet ---
    const summaryWs = XLSX.utils.aoa_to_sheet([[]]);
    const summaryHeader = ['Sr. No', 'Description', `Total (${currencyInfo.value})`];
    summaryWs['!rows'] = [{ hpt: 25 }];
    summaryHeader.forEach((val, i) => summaryWs[XLSX.utils.encode_cell({c: i, r: 0})] = { v: val, s: headerStyle });
    
    let summaryRowIndex = 1;
    let projectGrandTotal = 0;

    rooms.forEach((room, index) => {
        if (room.boq) {
            let roomTotalAfterMargin = 0;
            room.boq.forEach(item => {
                const itemMarginPercent = typeof item.margin === 'number' ? item.margin : margin;
                const itemMarginMultiplier = 1 + itemMarginPercent / 100;
                roomTotalAfterMargin += (item.totalPrice * rate) * itemMarginMultiplier;
            });
            const roomFinalTotal = roomTotalAfterMargin * (1 + gstRate);
            projectGrandTotal += roomFinalTotal;
            XLSX.utils.sheet_add_aoa(summaryWs, [[index + 1, room.name, roomFinalTotal]], { origin: `A${summaryRowIndex + 1}`});
            summaryRowIndex++;
        }
    });
    
    XLSX.utils.sheet_add_aoa(summaryWs, [['', createStyledCell('Grand Total', totalStyle), createStyledCell(projectGrandTotal, totalStyle, 'n')]], { origin: `A${summaryRowIndex + 2}`});
    summaryWs['!cols'] = [{ wch: 10 }, { wch: 40 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Proposal Summary');

    // --- Commercial Terms Sheet ---
    const termsWs = XLSX.utils.aoa_to_sheet([]);
    let termsRowIndex = 0;
    Object.entries(companyTemplate.commercialTerms).forEach(([title, data]) => {
        termsRowIndex++; // Spacer
        termsWs[XLSX.utils.encode_cell({r: termsRowIndex, c: 0})] = { v: title, s: sectionHeaderStyle };
        termsWs["!merges"] = termsWs["!merges"] || [];
        termsWs["!merges"].push({ s: { r: termsRowIndex, c: 0 }, e: { r: termsRowIndex, c: 1 } });
        termsRowIndex++;
        if (data.length > 0) {
            const termsHeader = data[0];
            termsHeader.forEach((val, i) => termsWs[XLSX.utils.encode_cell({c: i, r: termsRowIndex})] = { v: val, s: headerStyle });
            termsRowIndex++;
            XLSX.utils.sheet_add_aoa(termsWs, data.slice(1), { origin: `A${termsRowIndex}` });
            termsRowIndex += data.slice(1).length;
        }
    });
    termsWs['!cols'] = [{ wch: 10 }, { wch: 100 }];
    XLSX.utils.book_append_sheet(wb, termsWs, 'Commercial Terms');

    // --- Individual Room Sheets ---
    for (const room of rooms) {
        if (room.boq) {
            const roomWs = XLSX.utils.aoa_to_sheet([]);
            let roomHeader: string[];
            let colWidths: { wch: number }[];

            if (isINR) {
                roomHeader = ['Sr. No.', 'Description of Goods / Services', 'Specifications', 'Make', 'Source', 'Qty.', 'Unit Rate (INR)', 'Total Amount (INR)', 'SGST 9% (INR)', 'CGST 9% (INR)', 'Final Amount (INR)'];
                colWidths = [ { wch: 8 }, { wch: 40 }, { wch: 25 }, { wch: 20 }, { wch: 8 }, { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
            } else {
                roomHeader = ['Sr. No.', 'Description of Goods / Services', 'Specifications', 'Make', 'Source', 'Qty.', `Unit Rate (${currencyInfo.value})`, `Total Amount (${currencyInfo.value})`, `Tax (18%) (${currencyInfo.value})`, `Final Amount (${currencyInfo.value})`];
                colWidths = [ { wch: 8 }, { wch: 40 }, { wch: 25 }, { wch: 20 }, { wch: 8 }, { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
            }

            roomWs['!rows'] = [{ hpt: 25 }];
            roomHeader.forEach((val, i) => roomWs[XLSX.utils.encode_cell({c: i, r: 0})] = { v: val, s: headerStyle });
            
            let roomSubTotal = 0, roomSgstTotal = 0, roomCgstTotal = 0, roomTaxTotal = 0, roomGrandTotal = 0;
            let rowIndex = 1; // Tracks the current 0-indexed row in the worksheet, starting after the header (row 0).
            let itemSrNo = 1;

            const groupedBoq = room.boq.reduce((acc, item) => {
                const category = item.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(item);
                return acc;
            }, {} as Record<string, BoqItem[]>);

            const categoryOrder = [
                "Display", "Video Conferencing & Cameras", "Video Distribution & Switching",
                "Audio - Microphones", "Audio - DSP & Amplification", "Audio - Speakers",
                "Control System & Environmental", "Acoustic Treatment", "Cabling & Infrastructure",
                "Mounts & Racks", "Accessories & Services"
            ];

            const orderedCategoriesInBoq = categoryOrder.filter(cat => groupedBoq[cat]);
            Object.keys(groupedBoq).forEach(cat => {
                if (!orderedCategoriesInBoq.includes(cat)) {
                    orderedCategoriesInBoq.push(cat);
                }
            });

            for (const category of orderedCategoriesInBoq) {
                const itemsInCategory = groupedBoq[category];
                if (!itemsInCategory || itemsInCategory.length === 0) continue;

                // Add category header row
                roomWs["!merges"] = roomWs["!merges"] || [];
                roomWs["!merges"].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: roomHeader.length - 1 } });
                XLSX.utils.sheet_add_aoa(roomWs, [[createStyledCell(category, sectionHeaderStyle)]], { origin: `A${rowIndex + 1}` });
                rowIndex++;

                itemsInCategory.forEach(item => {
                    const unitPriceConverted = item.unitPrice * rate;
                    const currentItemMarginPercent = typeof item.margin === 'number' ? item.margin : margin;
                    const marginMultiplier = 1 + currentItemMarginPercent / 100;

                    const unitPriceWithMargin = unitPriceConverted * marginMultiplier;
                    const totalPriceWithMargin = unitPriceWithMargin * item.quantity;
                    
                    let rowData: any[];

                    if (isINR) {
                        const sgstAmount = totalPriceWithMargin * sgstRate;
                        const cgstAmount = totalPriceWithMargin * cgstRate;
                        const finalTotalPrice = totalPriceWithMargin + sgstAmount + cgstAmount;
                        roomSgstTotal += sgstAmount;
                        roomCgstTotal += cgstAmount;
                        rowData = [ itemSrNo, item.itemDescription, item.model, item.brand, item.source.toUpperCase(), item.quantity, unitPriceWithMargin, totalPriceWithMargin, sgstAmount, cgstAmount, finalTotalPrice ];
                    } else {
                        const taxAmount = totalPriceWithMargin * gstRate;
                        const finalTotalPrice = totalPriceWithMargin + taxAmount;
                        roomTaxTotal += taxAmount;
                        rowData = [ itemSrNo, item.itemDescription, item.model, item.brand, item.source.toUpperCase(), item.quantity, unitPriceWithMargin, totalPriceWithMargin, taxAmount, finalTotalPrice ];
                    }

                    roomSubTotal += totalPriceWithMargin;
                    roomGrandTotal += rowData[rowData.length - 1];

                    XLSX.utils.sheet_add_aoa(roomWs, [rowData.map((val, i) => createStyledCell(val, {}, i > 4 ? 'n' : 's'))], { origin: `A${rowIndex + 1}` });
                    itemSrNo++;
                    rowIndex++;
                });
            }
            
            rowIndex++; // Spacer row
            const totalRowStart = rowIndex + 1;
            const totalsOriginCol = String.fromCharCode(65 + roomHeader.length - 2);
            let totalRows: [string, number][] = [
                ['Subtotal:', roomSubTotal],
            ];

            if (isINR) {
                totalRows.push(['Total SGST (9%):', roomSgstTotal], ['Total CGST (9%):', roomCgstTotal]);
            } else {
                totalRows.push(['Total Tax (18%):', roomTaxTotal]);
            }
            totalRows.push(['Grand Total:', roomGrandTotal]);

            totalRows.forEach((data, i) => {
                XLSX.utils.sheet_add_aoa(roomWs, [[createStyledCell(data[0], totalStyle), createStyledCell(data[1], totalStyle, 'n')]], { origin: `${totalsOriginCol}${totalRowStart + i}`});
            });

            roomWs['!cols'] = colWidths;
            XLSX.utils.book_append_sheet(wb, roomWs, getUniqueSheetName(room.name));
        }
    }

    XLSX.writeFile(wb, `${clientDetails.projectName || 'BOQ'}_${new Date().toISOString().split('T')[0]}.xlsx`);
};