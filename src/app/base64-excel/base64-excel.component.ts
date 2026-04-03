import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-base64-excel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './base64-excel.component.html',
  styleUrls: ['./base64-excel.component.css']
})
export class Base64ExcelComponent {
  base64Input = '';
  fileName = 'converted-file.xlsx';
  error = '';
  success = '';

  downloadExcel(): void {
    this.error = '';
    this.success = '';

    try {
      if (!this.base64Input.trim()) {
        this.error = 'Please paste a Base64 string.';
        return;
      }

      let cleanBase64 = this.base64Input.trim();

      if (cleanBase64.includes(',')) {
        cleanBase64 = cleanBase64.split(',')[1];
      }

      const binaryString = atob(cleanBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName || 'converted-file.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
      this.success = 'Excel file downloaded successfully.';
    } catch (err) {
      this.error = 'Invalid Base64 string.';
    }
  }

  clearAll(): void {
    this.base64Input = '';
    this.fileName = 'converted-file.xlsx';
    this.error = '';
    this.success = '';
  }
}