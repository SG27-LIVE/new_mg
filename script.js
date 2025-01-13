document.addEventListener('DOMContentLoaded', () => {
  const manifestForm = document.getElementById('manifestForm');
  const awbNumberField = document.getElementById('awbNumber');
  const productNameField = document.getElementById('productName');
  const pickupDateField = document.getElementById('pickupDate');
  const shipmentCountField = document.getElementById('shipmentCount');

  const generateManifestTable = () => {
    const awbNumbers = awbNumberField.value.split('\n').map(num => num.trim());
    const tableBody = document.getElementById('manifestTableBody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Detect duplicate AWB numbers
    const duplicates = new Set();
    const seen = new Set();

    awbNumbers.forEach(num => {
      if (seen.has(num)) duplicates.add(num);
      else seen.add(num);
    });

    // Generate rows with 4 AWB numbers per row
    for (let i = 0; i < awbNumbers.length; i += 4) {
      const row = document.createElement('tr');

      for (let j = 0; j < 4; j++) {
        const index = i + j;
        const cellNo = document.createElement('td');
        const cellAwb = document.createElement('td');

        if (index < awbNumbers.length) {
          cellNo.textContent = index + 1;
          cellAwb.textContent = awbNumbers[index];
          if (duplicates.has(awbNumbers[index])) {
            cellAwb.classList.add('highlight');
          }
        }

        row.appendChild(cellNo);
        row.appendChild(cellAwb);
      }

      tableBody.appendChild(row);
    }
  };

  const printManifest = () => {
    const pickupDate = pickupDateField.value;
    const shipmentCount = shipmentCountField.value;

    if (!pickupDate || !shipmentCount) {
      alert('Please fill in Date of Pick Up and Number of Shipments.');
      return;
    }

    document.getElementById('manualPickupDate').textContent = pickupDate;
    document.getElementById('manualShipment').textContent = shipmentCount;

    const printContent = document.getElementById('printArea').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  manifestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    generateManifestTable();
  });

  document.getElementById('printManifest').addEventListener('click', (event) => {
    event.preventDefault();
    printManifest();
  });

  // Other event listeners for download buttons remain the same
});
