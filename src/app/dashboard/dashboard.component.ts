import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
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

    traditionalActivistReflectorScore: string;
    onlineActivistReflectorScore: string;
    traditionalSensingIntuitiveScore: string;
    onlineSensingIntuitiveScore: string;
    traditionalSequentialGlobalScore: string;
    onlineSequentialGlobalScore: string;
    traditionalVisualVerbalScore: string;
    onlineVisualVerbalScore: string;
  }[] = [];

  colors = {
    activist: '#bf504c',
    reflector: '#d18280',
    sensing: '#4aacc5',
    intuitive: '#78c1d3',
    sequential: '#8065a2',
    global: '#9c86b6',
    visual: '#9ab75a',
    verbal: '#b7cc8a',
  } as const;

  traditionalActivistReflectorDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Activist', 'Reflector'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };
  onlineActivistReflectorDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Activist', 'Reflector'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };
  traditionalSensingIntuitiveDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Sensing', 'Intuitive'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };
  onlineSensingIntuitiveDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Sensing', 'Intuitive'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };
  traditionalSequentialGlobalDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Sequential', 'Global'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };
  onlineSequentialGlobalDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Sequential', 'Global'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };
  traditionalVisualVerbalDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Visual', 'Verbal'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };
  onlineVisualVerbalDonutChart: {
    labels: string[];
    datasets: ChartConfiguration<'doughnut'>['data']['datasets'];
    options: ChartConfiguration<'doughnut'>['options'];
  } = {
    labels: ['Visual', 'Verbal'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f28c18', '#6d3a9c'],
      },
    ],
    options: { responsive: false, borderColor: 'transparent', color: 'white' },
  };

  traditionalBarChart: {
    labels: string[];
    datasets: ChartData<'bar', { x: string; y: number }[]>['datasets'];
    options: ChartConfiguration<'bar'>['options'];
  } = {
    labels: ['A', 'B'],
    datasets: [{ data: [] }],
    options: { responsive: false, borderColor: 'transparent' },
  };

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
    let finalTraditionalActivistCount = 0;
    let finalTraditionalReflectorCount = 0;

    let finalTraditionalSensingCount = 0;
    let finalTraditionalIntuitiveCount = 0;

    let finalTraditionalSequentialCount = 0;
    let finalTraditionalGlobalCount = 0;

    let finalTraditionalVisualCount = 0;
    let finalTraditionalVerbalCount = 0;

    let finalOnlineActivistCount = 0;
    let finalOnlineReflectorCount = 0;

    let finalOnlineSensingCount = 0;
    let finalOnlineIntuitiveCount = 0;

    let finalOnlineSequentialCount = 0;
    let finalOnlineGlobalCount = 0;

    let finalOnlineVisualCount = 0;
    let finalOnlineVerbalCount = 0;

    this.data.forEach((row, index) => {
      const name = index.toString();

      const {
        finalScore: finalTraditionalActivistReflectorScore,
        aScore: traditionalActivistScore,
        bScore: traditionalReflectorScore,
      } = this.calculateScorePerCategory(
        activistReflectorTraditionalQuestions,
        row
      );
      if (traditionalActivistScore > traditionalReflectorScore) {
        finalTraditionalActivistCount += 1;
      } else {
        finalTraditionalReflectorCount += 1;
      }

      const {
        finalScore: finalOnlineActivistReflectorScore,
        aScore: onlineActivistScore,
        bScore: onlineReflectorScore,
      } = this.calculateScorePerCategory(activistReflectorOnlineQuestions, row);
      if (onlineActivistScore > onlineReflectorScore) {
        finalOnlineActivistCount += 1;
      } else {
        finalOnlineReflectorCount += 1;
      }

      const {
        finalScore: finalTraditionalSensingIntuitiveScore,
        aScore: traditionalSensingScore,
        bScore: traditionalIntuitiveScore,
      } = this.calculateScorePerCategory(
        sensingIntuitiveTraditionalQuestions,
        row
      );
      if (traditionalSensingScore > traditionalIntuitiveScore) {
        finalTraditionalSensingCount += 1;
      } else {
        finalTraditionalIntuitiveCount += 1;
      }

      const {
        finalScore: finalOnlineSensingIntuitiveScore,
        aScore: onlineSensingScore,
        bScore: onlineIntuitiveScore,
      } = this.calculateScorePerCategory(sensingIntuitiveOnlineQuestions, row);
      if (onlineSensingScore > onlineIntuitiveScore) {
        finalOnlineSensingCount += 1;
      } else {
        finalOnlineIntuitiveCount += 1;
      }

      const {
        finalScore: finalTraditionalVisualVerbalScore,
        aScore: traditionalVisualScore,
        bScore: traditionalVerbalScore,
      } = this.calculateScorePerCategory(visualVerbalTraditionalQuestions, row);
      if (traditionalVisualScore > traditionalVerbalScore) {
        finalTraditionalVisualCount += 1;
      } else {
        finalTraditionalVerbalCount += 1;
      }

      const {
        finalScore: finalOnlineVisualVerbalScore,
        aScore: onlineVisualScore,
        bScore: onlineVerbalScore,
      } = this.calculateScorePerCategory(visualVerbalOnlineQuestions, row);
      if (onlineVisualScore > onlineVerbalScore) {
        finalOnlineVisualCount += 1;
      } else {
        finalOnlineVerbalCount += 1;
      }

      const {
        finalScore: finalTraditionalSequentialGlobalScore,
        aScore: traditionalSequentialScore,
        bScore: traditionalGlobalScore,
      } = this.calculateScorePerCategory(
        sequentialGlobalTraditionalQuestions,
        row
      );
      if (traditionalSequentialScore > traditionalGlobalScore) {
        finalTraditionalSequentialCount += 1;
      } else {
        finalTraditionalGlobalCount += 1;
      }

      const {
        finalScore: finalOnlineSequentialGlobalScore,
        aScore: onlineSequentialScore,
        bScore: onlineGlobalScore,
      } = this.calculateScorePerCategory(sequentialGlobalOnlineQuestions, row);
      if (onlineSequentialScore > onlineGlobalScore) {
        finalOnlineSequentialCount += 1;
      } else {
        finalOnlineGlobalCount += 1;
      }

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
        traditionalActivistReflectorScore:
          finalTraditionalActivistReflectorScore,
        onlineActivistReflectorScore: finalOnlineActivistReflectorScore,
        onlineSensingIntuitiveScore: finalOnlineSensingIntuitiveScore,
        onlineSequentialGlobalScore: finalOnlineSequentialGlobalScore,
        onlineVisualVerbalScore: finalOnlineVisualVerbalScore,
        traditionalSensingIntuitiveScore: finalTraditionalSensingIntuitiveScore,
        traditionalSequentialGlobalScore: finalTraditionalSequentialGlobalScore,
        traditionalVisualVerbalScore: finalTraditionalVisualVerbalScore,
      });
    });

    this.traditionalActivistReflectorDonutChart = {
      labels: ['Activist', 'Reflector'],
      datasets: [
        {
          data: [finalTraditionalActivistCount, finalTraditionalReflectorCount],
          backgroundColor: [this.colors.activist, this.colors.reflector],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.onlineActivistReflectorDonutChart = {
      labels: ['Activist', 'Reflector'],
      datasets: [
        {
          data: [finalOnlineActivistCount, finalOnlineReflectorCount],
          backgroundColor: [this.colors.activist, this.colors.reflector],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.traditionalSensingIntuitiveDonutChart = {
      labels: ['Sensing', 'Intuitive'],
      datasets: [
        {
          data: [finalTraditionalSensingCount, finalTraditionalIntuitiveCount],
          backgroundColor: [this.colors.sensing, this.colors.intuitive],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.onlineSensingIntuitiveDonutChart = {
      labels: ['Sensing', 'Intuitive'],
      datasets: [
        {
          data: [finalOnlineSensingCount, finalOnlineIntuitiveCount],
          backgroundColor: [this.colors.sensing, this.colors.intuitive],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.traditionalSequentialGlobalDonutChart = {
      labels: ['Sequential', 'Global'],
      datasets: [
        {
          data: [finalTraditionalSequentialCount, finalTraditionalGlobalCount],
          backgroundColor: [this.colors.sequential, this.colors.global],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.onlineSequentialGlobalDonutChart = {
      labels: ['Sequential', 'Global'],
      datasets: [
        {
          data: [finalOnlineSequentialCount, finalOnlineGlobalCount],
          backgroundColor: [this.colors.sequential, this.colors.global],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.traditionalVisualVerbalDonutChart = {
      labels: ['Visual', 'Verbal'],
      datasets: [
        {
          data: [finalTraditionalVisualCount, finalTraditionalVerbalCount],
          backgroundColor: [this.colors.visual, this.colors.verbal],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.onlineVisualVerbalDonutChart = {
      labels: ['Visual', 'Verbal'],
      datasets: [
        {
          data: [finalOnlineVisualCount, finalOnlineVerbalCount],
          backgroundColor: [this.colors.visual, this.colors.verbal],
        },
      ],
      options: {
        responsive: false,
        borderColor: 'transparent',
        color: 'white',
      },
    };

    this.traditionalBarChart = {
      labels: [],
      datasets: [
        {
          data: [
            { x: 'Activist/Reflector', y: finalTraditionalActivistCount },
            { x: 'Sensing/Intuitive', y: finalTraditionalSensingCount },
            { x: 'Sequential/Global', y: finalTraditionalSequentialCount },
            { x: 'Visual/Verbal', y: finalTraditionalVisualCount },
          ],
          backgroundColor: [
            this.colors.activist,
            this.colors.sensing,
            this.colors.sequential,
            this.colors.visual,
          ],
        },
        {
          data: [
            { x: 'Activist/Reflector', y: finalTraditionalReflectorCount },
            { x: 'Sensing/Intuitive', y: finalTraditionalIntuitiveCount },
            { x: 'Sequential/Global', y: finalTraditionalGlobalCount },
            { x: 'Visual/Verbal', y: finalTraditionalVerbalCount },
          ],
          backgroundColor: [
            this.colors.reflector,
            this.colors.sensing,
            this.colors.global,
            this.colors.verbal,
          ],
        },
      ],
      options: {
        responsive: false,
      },
    };

    console.log({
      finalOnlineActivistCount,
      finalOnlineReflectorCount,
      finalOnlineSensingCount,
      finalOnlineIntuitiveCount,
      finalOnlineSequentialCount,
      finalOnlineGlobalCount,
      finalOnlineVisualCount,
      finalOnlineVerbalCount,
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
