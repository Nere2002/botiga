import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { GraficoService } from '../grafico.service';
import * as moment from 'moment';
@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent implements OnInit {
  chart: any;
  graficos: any[];

  constructor(private graficoService: GraficoService) {
    this.graficos = [];
  }

  ngOnInit() {
    this.getGrafico();
  }

  getGrafico() {
    this.graficoService.getGrafico().subscribe(
      (data: any[]) => {
        this.graficos = data;
        this.generateChart();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  generateChart() {
    const days = Array.from(new Set(this.graficos.map(grafico => moment(grafico.dia).format('YYYY-MM-DD'))));
    const productIds = Array.from(new Set(this.graficos.map(grafico => grafico.producte_id)));
    const datasets: { label: string; data: any[]; backgroundColor: string; borderColor: string; borderWidth: number; }[] = [];

    const colors = ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 0)', 'rgba(255, 128, 0)', 'rgba(247, 191, 190)', 'rgba(135, 206, 235)', 'rgba(182, 149, 192)']; // Colores de productos

    productIds.forEach((productId, index) => {
      const data = days.map(day => {
        const grafico = this.graficos.find(grafico => moment(grafico.dia).format('YYYY-MM-DD') === day && grafico.producte_id === productId);
        return grafico ? grafico.cantidad_vendida : 0;
      });

      const label = `Producto ${productId}`;

      datasets.push({
        label: label,
        data: data,
        backgroundColor: colors[index % colors.length], // Asignar color según el índice del producto
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1,
      });
    });

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Día',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad Vendida',
            },
          },
        },
      },
    });
  }


}



