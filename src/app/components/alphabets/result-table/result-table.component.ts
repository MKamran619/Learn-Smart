import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SpeechDetectService } from '../../../services/speechDetect/speech-detect.service';

@Component({
  selector: 'app-result-table',
  standalone: true,
  imports: [MatTableModule],
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
  dataSource: any[] = [];
  constructor(public accuracyService: SpeechDetectService) {}
  ngOnInit(): void {
    this.dataSource = this.accuracyService.resultList;
    const filteredRows = this.dataSource.filter(
      (row: any) => row.accuracy >= 100
    );

    // Sum up the scores of the filtered rows (assuming you have a 'score' field)
    this.totalScore = filteredRows.length;

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
}
