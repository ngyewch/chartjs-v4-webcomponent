import {LitElement, html, css, type PropertyValues} from 'lit';
import {customElement, query, queryAssignedNodes} from 'lit/decorators.js';
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

    @queryAssignedNodes({slot: ''})
    private contentNodes!: Array<Node>;

    protected render() {
        return html`
            <div class="container">
                <canvas id="chart"></canvas>
            </div>
            <div style="display: none;">
                <slot></slot>
            </div>
        `;
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        for (const node of this.contentNodes) {
            if (node instanceof HTMLScriptElement) {
                const scriptElement = node as HTMLScriptElement;
                if (scriptElement.type === 'application/json') {
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
                                    console.error('chartjs-v4', xhr.status, xhr.statusText);
                                }
                            }
                        };
                        xhr.send();
                    }
                }
                break;
            }
        }
    }

    private createChart(json: string): void {
        try {
            const chartConfig = JSON.parse(json) as ChartConfiguration;
            new Chart(this.chartElement, chartConfig);
        } catch (e) {
            console.error('chartjs-v4', e);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "chartjs-v4": ChartJS4;
    }
}
