import {LightningElement, api, track} from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import {loadScript} from 'lightning/platformResourceLoader';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class Chart extends LightningElement {
    @api loaderVariant = 'base';
    @api chartConfig;

    @track isChartJsInitialized;
	renderedCallback() {
		if (this.isChartJsInitialized) {
			return;
		}
        // load static resources.
		Promise.all([loadScript(this, chartjs)])
			.then(() => {
                this.isChartJsInitialized = true;
				const ctx = this.template.querySelector('canvas.barChart').getContext('2d');
				this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(this.chartConfig)));
				this.chart.canvas.parentNode.style.height = 'auto';
				this.chart.canvas.parentNode.style.width = '100%';
			})
			.catch(error => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: 'Error loading ChartJS',
						message: error.message,
						variant: 'error',
					})
				);
			});
	}
}
