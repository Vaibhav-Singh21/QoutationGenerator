import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './App.css';
import brandLogo from './assets/brandLogo.png';


function App() {
  const [items, setItems] = useState([{ name: '', quantity: '', unitPrice: '', amount: '' }]);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    senderAddress: '',
    clientName: '',
    clientAddress: '',
    clientGST: '',
    date: '',
    validityDate: '',
    termsOfPayment: 'full payment (advance)',
    subject: ''
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [gst, setGst] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const GST_RATE = 0.18; // 18% GST

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const calculatedGst = total * GST_RATE;
    const calculatedGrandTotal = total + calculatedGst;
    setTotalAmount(total);
    setGst(calculatedGst);
    setGrandTotal(calculatedGrandTotal);
  }, [items]);

  const handleChange = (index, event) => {
    const values = [...items];
    values[index][event.target.name] = event.target.value;
    if (event.target.name === 'quantity' || event.target.name === 'unitPrice') {
      const amount = values[index].quantity * values[index].unitPrice;
      values[index].amount = amount;
    }
    setItems(values);
  };

  const handleCompanyDetailsChange = (event) => {
    const { name, value } = event.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: '', unitPrice: '', amount: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();


    // Add brand logo at the top left
    const img = new Image();
    img.src = brandLogo;
    doc.addImage(img, 'PNG', 10, 10, 50, 20);

    // Set font and styles for header
    doc.setFontSize(12);
    doc.setTextColor(0);

    // Set font and styles for header
    doc.setFont('Montserrat', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0);

    // Add company details
    doc.text('ACCUSORT OVERSEAS PVT.LTD.', 70, 15);
    doc.setFontSize(10);
    doc.setFont('Montserrat', 'normal');
    doc.text('#1, SHIV COLONY, INDRI ROAD, LADWA', 70, 20);
    doc.text('Kurukshetra, Haryana 136132', 70, 25);
    doc.text('GST No.06AAVCA4068Q1ZS', 70, 30);
    doc.text('Phone: +91-89502-22172, 9720572781', 70, 35);

    // Add date and reference number
    doc.text(`DATE: ${companyDetails.date}`, 150, 15);
    doc.text('Ref. No: ACSUP071/27-06-2024', 150, 20);

    // Add quotation title
    doc.setFontSize(14);
    doc.setFont('Montserrat', 'bold');
    doc.text('QUOTATION', 105, 50, null, null, 'center');

    // Add client details
    doc.setFontSize(12);
    doc.setFont('Montserrat', 'normal');
    doc.text(`To,`, 10, 60);
    doc.text(`${companyDetails.clientName}`, 10, 65);
    doc.text(`${companyDetails.clientAddress}`, 10, 70);
    doc.text(`G.S.T.: ${companyDetails.clientGST}`, 10, 75);

    // Add subject and introductory text
    doc.setFontSize(12);
    doc.setFont('Montserrat', 'bold');
    doc.text(`Subject: - ${companyDetails.subject}`, 10, 85);
    doc.setFont('Montserrat', 'normal');
    doc.text('Dear Sir,', 10, 95);
    doc.text('This is in reference to the discussions we had with you regarding your requirement for Color Sorter', 10, 100);
    doc.text('Machine. Please find the quotation as per your requirement.', 10, 105);

    // Add table
    const tableColumn = ["MARK", "DESCRIPTION OF GOODS", "QUANTITY", "UNIT PRICE", "AMOUNTS"];
    const tableRows = [];

    items.forEach((item, index) => {
      const itemData = [
        index + 1,
        item.name,
        item.quantity,
        item.unitPrice,
        item.amount
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 110,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    // Add total amount, GST, and grand total
    doc.setFontSize(12);
    doc.setFont('Montserrat', 'bold');
    doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);
    doc.text(`GST (18%): ${gst.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 20);
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 30);

    // Add terms of payment, account details, and quotation validity
    doc.setFontSize(12);
    doc.setFont('Montserrat', 'bold');
    doc.text(`1. TERMS OF PAYMENT: ${companyDetails.termsOfPayment.toUpperCase()}.`, 10, doc.autoTable.previous.finalY + 40);
    doc.text('2. ACCOUNT DETAILS:', 10, doc.autoTable.previous.finalY + 50);
    doc.setFont('Montserrat', 'normal');
    doc.text('AC. HOLDER :- ACCUSORT OVERSEAS PVT.LTD.', 10, doc.autoTable.previous.finalY + 55);
    doc.text('BANK :- YES BANK LTD.', 10, doc.autoTable.previous.finalY + 60);
    doc.text('IFSC CODE :- YESB0000120', 10, doc.autoTable.previous.finalY + 65);
    doc.text('SAC NO :- 012063700002710', 10, doc.autoTable.previous.finalY + 70);
    doc.text('BRANCH :- AMBALA CANTT', 10, doc.autoTable.previous.finalY + 75);
    doc.setFont('Montserrat', 'bold');
    doc.text('3. Quotation Validity:- One month only', 10, doc.autoTable.previous.finalY + 80);

    // Add footer with warranty and contact information
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setFont('Montserrat', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text('Warranty for One Year starts from dispatched date.', 105, pageHeight - 30, null, null, 'center');
    doc.setTextColor(0);
    doc.text('Contact no. – +91-97205-72781', 105, pageHeight - 20, null, null, 'center');
    doc.text('Email - accusortoverseas@outlook.com', 105, pageHeight - 10, null, null, 'center');

    // Save the PDF
    doc.save(`${companyDetails.clientName}_quotation.pdf`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Business Quotation Generator
      </h1>
      <div className="mb-6 grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded">
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Company Name</Label>
          <Input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={companyDetails.companyName}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Sender Address</Label>
          <Input
            type="text"
            name="senderAddress"
            placeholder="Sender Address"
            value={companyDetails.senderAddress}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Client Name</Label>
          <Input
            type="text"
            name="clientName"
            placeholder="Client Name"
            value={companyDetails.clientName}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Client Address</Label>
          <Input
            type="text"
            name="clientAddress"
            placeholder="Client Address"
            value={companyDetails.clientAddress}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Client GST</Label>
          <Input
            type="text"
            name="clientGST"
            placeholder="Client GST"
            value={companyDetails.clientGST}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Date</Label>
          <Input
            type="date"
            name="date"
            placeholder="Date"
            value={companyDetails.date}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Validity Date</Label>
          <Input
            type="date"
            name="validityDate"
            placeholder="Validity Date"
            value={companyDetails.validityDate}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Terms of Payment</Label>
          <select
            name="termsOfPayment"
            value={companyDetails.termsOfPayment}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          >
            <option value="full payment (advance)">Full Payment (Advance)</option>
            <option value="half payment (pre-delivery)">Half Payment (Pre-Delivery)</option>
            <option value="payment done (post delivery)">Payment Done (Post Delivery)</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Subject</Label>
          <Input
            type="text"
            name="subject"
            placeholder="Subject"
            value={companyDetails.subject}
            onChange={handleCompanyDetailsChange}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded">
        {items.map((item, index) => (
          <div key={index} className="mb-4 grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4">
              <Label className="font-bold">Item Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Item Name"
                value={item.name}
                onChange={(event) => handleChange(index, event)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <Button onClick={() => handleRemoveItem(index)} className="ml-2">Remove</Button>
            </div>
            <div className="flex items-center space-x-4">
              <Label className="font-bold">Quantity</Label>
              <Input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(event) => handleChange(index, event)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label className="font-bold">Unit Price</Label>
              <Input
                type="number"
                name="unitPrice"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(event) => handleChange(index, event)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Label className="font-bold">Amount</Label>
              <Input
                type="number"
                name="amount"
                placeholder="Amount"
                value={item.amount}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        ))}
        <Button onClick={handleAddItem} className="mb-4 mr-4">Add Item</Button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded">
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Total Amount</Label>
          <Input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            value={totalAmount.toFixed(2)}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">GST (18%)</Label>
          <Input
            type="number"
            name="gst"
            placeholder="GST"
            value={gst.toFixed(2)}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-bold">Grand Total</Label>
          <Input
            type="number"
            name="grandTotal"
            placeholder="Grand Total"
            value={grandTotal.toFixed(2)}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <Button onClick={handleGeneratePDF}>Generate PDF</Button>
      </div>
    </div>
  )
}

export default App
