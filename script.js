document.addEventListener('DOMContentLoaded', () => {
  const generateManifest = () => {
    const productName = document.getElementById('productName').value;
    const awbNumbers = document.getElementById('awbNumber').value.split('\n').map(num => num.trim());
    const pickupDate = document.getElementById('pickupDate').value;
    const shipmentCount = document.getElementById('shipmentCount').value;

    const duplicates = new Set();
    const uniqueCheck = new Set();
    awbNumbers.forEach(num => {
      if (uniqueCheck.has(num)) duplicates.add(num);
      uniqueCheck.add(num);
    });

    let manifestDetails = `
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>AWB Number</th>
            <th>No.</th>
            <th>AWB Number</th>
            <th>No.</th>
            <th>AWB Number</th>
            <th>No.</th>
            <th>AWB Number</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 0; i < awbNumbers.length; i += 4) {
      manifestDetails += '<tr>';
      for (let j = i; j < i + 4; j++) {
        const awb = awbNumbers[j] || '';
        manifestDetails += `<td>${j + 1 || ''}</td>`;
        if (duplicates.has(awb)) {
          manifestDetails += `<td style="background-color: yellow;">${awb || ''}</td>`;
        } else {
          manifestDetails += `<td>${awb || ''}</td>`;
        }
      }
      manifestDetails += '</tr>';
    }

    manifestDetails += '</tbody></table>';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head><title>Manifest</title></head>
      <body>
        <h1>Manifest - ${productName}</h1>
        <p><strong>Date of Pick Up:</strong> ${pickupDate}</p>
        <p><strong>Number of Shipments:</strong> ${shipmentCount}</p>
        ${manifestDetails}
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadExcel = () => {
    const awbNumbers = document.getElementById('awbNumber').value.split('\n').map(num => num.trim());
    const productName = document.getElementById('productName').value;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([['No.', 'AWB Number']]);

    awbNumbers.forEach((awb, index) => {
      XLSX.utils.sheet_add_aoa(worksheet, [[index + 1, awb]], { origin: -1 });
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Manifest');
    XLSX.writeFile(workbook, `Manifest_${productName}.xlsx`);
  };

  const downloadPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const productName = document.getElementById('productName').value;
    const awbNumbers = document.getElementById('awbNumber').value.split('\n').map(num => num.trim());
    const pickupDate = document.getElementById('pickupDate').value;
    const shipmentCount = document.getElementById('shipmentCount').value;

    doc.text(`Manifest - ${productName}`, 10, 10);
    doc.text(`Date of Pick Up: ${pickupDate}`, 10, 20);
    doc.text(`Number of Shipments: ${shipmentCount}`, 10, 30);

    const tableData = [];
    for (let i = 0; i < awbNumbers.length; i += 4) {
      const row = awbNumbers.slice(i, i + 4);
      while (row.length < 4) row.push('');
      tableData.push(row);
    }

    doc.autoTable({
      head: [['No.', 'AWB Number', 'No.', 'AWB Number', 'No.', 'AWB Number', 'No.', 'AWB Number']],
      body: tableData.map((row, index) => [
        index * 4 + 1, row[0], index * 4 + 2, row[1], index * 4 + 3, row[2], index * 4 + 4, row[3],
      ]),
    });

    doc.save(`Manifest_${productName}.pdf`);
  };

  document.getElementById('generateManifest').addEventListener('click', generateManifest);
  document.getElementById('downloadExcel').addEventListener('click', downloadExcel);
  document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
});
