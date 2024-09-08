import {LitElement, html, css} from 'lit';
import {customElement, query, queryAssignedElements} from 'lit/decorators.js';
import Chart, {type ChartConfiguration} from 'chart.js/auto';

@customElement('chartjs-v4')
export class ChartJS4 extends LitElement {
    public static styles = css`
        .container {
            width: 100%;
            height: 100%;
        }
    `;

    @query('#chart')
    private chartElement!: HTMLCanvasElement;

    @queryAssignedElements({slot: ''})
    private scriptElements!: Array<HTMLElement>;

    private chart: Chart | undefined;

    protected render() {
        return html`
            <div class="container">
                <canvas id="chart"></canvas>
            </div>
            <div style="display: none;">
                <slot @slotchange=${this.handleSlotChange}></slot>
            </div>
        `;
    }

    private createChart(json: string): void {
        if (this.chart !== undefined) {
            this.chart.destroy();
            this.chart = undefined;
        }
        try {
            const chartConfig = JSON.parse(json) as ChartConfiguration;
            this.chart = new Chart(this.chartElement, chartConfig);
        } catch (e) {
            console.error('chartjs-v4', this.id, e);
        }
    }

    private handleSlotChange() {
        if (this.scriptElements.length === 0) {
            return;
        }
        let handled = false;
        for (const element of this.scriptElements) {
            if (element instanceof HTMLScriptElement) {
                const scriptElement = element as HTMLScriptElement;
                if (scriptElement.type === 'application/json') {
                    if (handled) {
                        console.warn('chartjs-v4', this.id, `additional configuration ignored`);
                        continue;
                    }
                    handled = true;
                    if (scriptElement.src === '') {
                        this.createChart(scriptElement.innerText);
                    } else {
                        const xhr = new XMLHttpRequest();
                        xhr.open("GET", scriptElement.src)
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (xhr.status === 200) {
                                    this.createChart(xhr.responseText);
                                } else {
                                    console.error('chartjs-v4', this.id, xhr.status, xhr.statusText);
                                }
                            }
                        };
                        xhr.send();
                    }
                } else {
                    console.warn('chartjs-v4', this.id, `unsupported script type: '${scriptElement.type}'`);
                }
            } else {
                console.warn('chartjs-v4', this.id, `unsupported element: ${element.tagName}`);
            }
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "chartjs-v4": ChartJS4;
    }
}
