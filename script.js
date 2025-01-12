document.addEventListener('DOMContentLoaded', () => {
  const manifestForm = document.getElementById('manifestForm');
  const awbNumberField = document.getElementById('awbNumber');
  const productNameField = document.getElementById('productName');
  const pickupDateField = document.getElementById('pickupDate');
  const shipmentCountField = document.getElementById('shipmentCount');

  // Function to generate manifest table
  const generateManifestTable = () => {
    const awbNumbers = awbNumberField.value.split('\n').map(num => num.trim());
    const tableBody = document.getElementById('manifestTableBody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Detect duplicate AWB numbers
    const duplicateChecker = new Set();
    const duplicates = new Set();

    awbNumbers.forEach(num => {
      if (duplicateChecker.has(num)) {
        duplicates.add(num);
      }
      duplicateChecker.add(num);
    });

    // Populate table rows
    for (let i = 0; i < awbNumbers.length; i += 4) {
      const row = document.createElement('tr');

      for (let j = 0; j < 4; j++) {
        const awbIndex = i + j;
        const cellNo = document.createElement('td');
        const cellAwb = document.createElement('td');

        if (awbIndex < awbNumbers.length) {
          cellNo.textContent = awbIndex + 1;
          cellAwb.textContent = awbNumbers[awbIndex];
          if (duplicates.has(awbNumbers[awbIndex])) {
            cellAwb.style.backgroundColor = 'yellow';
          }
        }

        row.appendChild(cellNo);
        row.appendChild(cellAwb);
      }
      tableBody.appendChild(row);
    }
  };

  // Function to download manifest as Excel
  const downloadAsExcel = () => {
    const awbNumbers = awbNumberField.value.split('\n').map(num => num.trim());
    const workbook = XLSX.utils.book_new();
    const worksheetData = [['No.', 'AWB Number', 'No.', 'AWB Number', 'No.', 'AWB Number', 'No.', 'AWB Number']];

    for (let i = 0; i < awbNumbers.length; i += 4) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        const index = i + j;
        row.push(index + 1);
        row.push(index < awbNumbers.length ? awbNumbers[index] : '');
      }
      worksheetData.push(row);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Manifest');
    XLSX.writeFile(workbook, `Manifest_${productNameField.value}.xlsx`);
  };

  // Function to download manifest as PDF
  const downloadAsPDF = () => {
    const productName = productNameField.value;
    const awbNumbers = awbNumberField.value.split('\n').map(num => num.trim());
    const pickupDate = pickupDateField.value;
    const shipmentCount = shipmentCountField.value;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

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
      startY: 40,
    });

    doc.save(`Manifest_${productName}.pdf`);
  };

  // Event listeners
  manifestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    generateManifestTable();
  });

  document.getElementById('downloadExcel').addEventListener('click', (event) => {
    event.preventDefault();
    downloadAsExcel();
  });

  document.getElementById('downloadPDF').addEventListener('click', (event) => {
    event.preventDefault();
    downloadAsPDF();
  });
});
