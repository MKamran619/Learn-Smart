import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SpeechDetectService } from '../../../../services/speechDetect/speech-detect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './result-table.component.html',
  styleUrl: './result-table.component.scss',
})
export class ResultTableComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'letter',
    'letterSubstituted',
    'accuracy',
    'noResponse',
  ];
  totalScore = 0;
  dataSource: any[] = [{ sentence: '' }, { sentence: '' }];
  constructor(public accuracyService: SpeechDetectService) {}
  ngOnInit(): void {
    this.dataSource = this.accuracyService.resultList;
    const filteredRows = this.dataSource.filter(
      (row: any) => row.accuracy >= 100
    );

    this.totalScore = filteredRows.length;
  }
}
