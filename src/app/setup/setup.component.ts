import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { parse } from 'csv-parse/browser/esm/sync';
import { DataService } from '../data.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent {
  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly dataService: DataService,
    private readonly router: Router
  ) {}

  parseCSV(contents: string) {
    const records = parse(contents, {
      columns: true,
      skip_empty_lines: true,
    });
    this.dataService.insertData(records);
    this.router.navigateByUrl('/');
  }

  handleFile() {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const contents = event.target?.result;
      if (!contents || typeof contents !== 'string') {
        return;
      }
      this.parseCSV(contents);
    };

    if (this.fileInput.nativeElement.files?.[0].name) {
      reader.readAsText(this.fileInput.nativeElement.files[0]);
    }
  }
}
