import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { DataService } from '../data.service';
import { SurveyData } from '../survey.interface';
import {
  activistReflectorOnlineQuestions,
  activistReflectorTraditionalQuestions,
  sensingIntuitiveOnlineQuestions,
  sensingIntuitiveTraditionalQuestions,
  sequentialGlobalOnlineQuestions,
  sequentialGlobalTraditionalQuestions,
  visualVerbalOnlineQuestions,
  visualVerbalTraditionalQuestions,
} from './constants.utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  showEmptyState = false;
  data: SurveyData[] = [];

  countOfRecords: number = 0;
  timeSinceLastInsert: string = '';
  studentsScore: {
    name: string;
    traditionalActivistScore: number;
    onlineActivistScore: number;
    traditionalReflectorScore: number;
    onlineReflectorScore: number;
    traditionalSensingScore: number;
    onlineSensingScore: number;
    traditionalIntuitiveScore: number;
    onlineIntuitiveScore: number;
    traditionalSequentialScore: number;
    onlineSequentialScore: number;
    traditionalGlobalScore: number;
    onlineGlobalScore: number;
    traditionalVisualScore: number;
    onlineVisualScore: number;
    traditionalVerbalScore: number;
    onlineVerbalScore: number;
  }[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const data = this.dataService.getData();
    if (!data) {
      this.showEmptyState = true;
    } else {
      this.data = data;
      this.calculateRecords();
    }
  }

  calculateRecords() {
    this.calculateCount();
    this.calculateMostRecentInsert();
    this.calculateStudentsScore();
  }

  calculateCount() {
    this.countOfRecords = this.data.length;
  }

  calculateMostRecentInsert() {
    const lastRecord = this.data.at(-1);
    if (!lastRecord) {
      this.timeSinceLastInsert = 'NaN';
      return;
    }
    const lastInsertTime = DateTime.fromMillis(
      Date.parse(lastRecord.Timestamp)
    );
    this.timeSinceLastInsert = lastInsertTime.toRelative({}) as string;
  }

  calculateStudentsScore() {
    this.data.forEach((row) => {
      const name = row['What is your name?'];

      const {
        finalScore: finalTraditionalActivistReflectorScore,
        aScore: traditionalActivistScore,
        bScore: traditionalReflectorScore,
      } = this.calculateScorePerCategory(
        activistReflectorTraditionalQuestions,
        row
      );
      const {
        finalScore: finalOnlineActivistReflectorScore,
        aScore: onlineActivistScore,
        bScore: onlineReflectorScore,
      } = this.calculateScorePerCategory(activistReflectorOnlineQuestions, row);

      const {
        finalScore: finalTraditionalSensingIntuitiveScore,
        aScore: traditionalSensingScore,
        bScore: traditionalIntuitiveScore,
      } = this.calculateScorePerCategory(
        sensingIntuitiveTraditionalQuestions,
        row
      );
      const {
        finalScore: finalOnlineSensingIntuitiveScore,
        aScore: onlineSensingScore,
        bScore: onlineIntuitiveScore,
      } = this.calculateScorePerCategory(sensingIntuitiveOnlineQuestions, row);

      const {
        finalScore: finalTraditionalVisualVerbalScore,
        aScore: traditionalVerbalScore,
        bScore: traditionalVisualScore,
      } = this.calculateScorePerCategory(visualVerbalTraditionalQuestions, row);
      const {
        finalScore: finalOnlineVisualVerbalScore,
        aScore: onlineVisualScore,
        bScore: onlineVerbalScore,
      } = this.calculateScorePerCategory(visualVerbalOnlineQuestions, row);

      const {
        finalScore: finalTraditionalSequentialGlobalScore,
        aScore: traditionalSequentialScore,
        bScore: traditionalGlobalScore,
      } = this.calculateScorePerCategory(
        sequentialGlobalTraditionalQuestions,
        row
      );
      const {
        finalScore: finalOnlineSequentialGlobalScore,
        aScore: onlineSequentialScore,
        bScore: onlineGlobalScore,
      } = this.calculateScorePerCategory(sequentialGlobalOnlineQuestions, row);

      this.studentsScore.push({
        name,
        onlineActivistScore,
        onlineGlobalScore,
        onlineIntuitiveScore,
        onlineReflectorScore,
        onlineSensingScore,
        onlineSequentialScore,
        onlineVerbalScore,
        onlineVisualScore,
        traditionalActivistScore,
        traditionalGlobalScore,
        traditionalIntuitiveScore,
        traditionalReflectorScore,
        traditionalSensingScore,
        traditionalSequentialScore,
        traditionalVerbalScore,
        traditionalVisualScore,
      });
    });
  }

  calculateScorePerCategory(
    questions: {
      question: string;
      a: string;
      b: string;
    }[],
    row: SurveyData
  ) {
    let aScore = 0;
    let bScore = 0;
    questions.forEach((question) => {
      if (row[question.question] === question.a) {
        aScore += 1;
      } else {
        bScore += 1;
      }
    });
    let finalScore: string = Math.abs(aScore - bScore).toString();
    if (aScore > bScore) {
      finalScore += 'A';
    } else {
      finalScore += 'B';
    }
    return { finalScore, aScore, bScore };
  }
}
