import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XMLParser } from 'fast-xml-parser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xml-compare.html',
  styleUrls: ['./xml-compare.css']
})
export class XmlCompareComponent {
  xml1 = `<root>
  <person>
    <name>John</name>
    <age>25</age>
  </person>
</root>`;

  xml2 = `<root>
  <person>
    <age>25</age>
    <name>John</name>
  </person>
</root>`;

  result = '';
  error = '';

  parsed1 = '';
  parsed2 = '';

  diffLeft: { text: string; type: string }[] = [];
  diffRight: { text: string; type: string }[] = [];

  compareXml(): void {
    this.error = '';
    this.result = '';
    this.parsed1 = '';
    this.parsed2 = '';
    this.diffLeft = [];
    this.diffRight = [];

    try {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        trimValues: true,
        parseTagValue: true
      });

      const obj1 = parser.parse(this.xml1);
      const obj2 = parser.parse(this.xml2);

      const normalized1 = this.sortObject(obj1);
      const normalized2 = this.sortObject(obj2);

      this.parsed1 = JSON.stringify(normalized1, null, 2);
      this.parsed2 = JSON.stringify(normalized2, null, 2);

      const areEqual =
        JSON.stringify(normalized1) === JSON.stringify(normalized2);

      this.result = areEqual
        ? 'XML documents are equal after normalization.'
        : 'XML documents are different.';

      this.generateColoredDiff(this.parsed1, this.parsed2);
    } catch (e: any) {
      this.error = 'Invalid XML: ' + (e?.message || 'Unknown error');
    }
  }

  private sortObject(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.sortObject(item));
    }

    if (value !== null && typeof value === 'object') {
      const sortedKeys = Object.keys(value).sort();
      const result: any = {};

      for (const key of sortedKeys) {
        result[key] = this.sortObject(value[key]);
      }

      return result;
    }

    return value;
  }

  private generateColoredDiff(left: string, right: string): void {
    const leftLines = left.split('\n');
    const rightLines = right.split('\n');

    this.diffLeft = leftLines.map((line) => ({
      text: line,
      type: rightLines.includes(line) ? 'normal' : 'removed'
    }));

    this.diffRight = rightLines.map((line) => ({
      text: line,
      type: leftLines.includes(line) ? 'normal' : 'added'
    }));
  }
}