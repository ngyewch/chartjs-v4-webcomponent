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

    private handleSlotChange() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }

        this.loadData('application/json')
            .then(jsonString => {
                try {
                    const chartConfig = JSON.parse(jsonString) as ChartConfiguration;
                    this.chart = new Chart(this.chartElement, chartConfig);
                } catch (e) {
                    console.error('chartjs-v4', this.id, 'error loading configuration', e);
                }
            })
            .catch(reason => {
                console.error('chartjs-v4', this.id, 'error loading configuration', reason);
            });
        if (this.scriptElements.length === 0) {
            return;
        }
    }

    private loadData(type: string, id?: string): Promise<string> {
        const scriptElements = this.getScriptElements(type, id);
        if (scriptElements.length === 0) {
            return new Promise((_, reject) => {
                reject(`${type} / ${id} not found`);
            });
        }
        if (scriptElements.length > 1) {
            console.warn('chartjs-v4', this.id, 'more than one matching data block found, using first', type, id);
        }
        return this.loadDataFromScript(scriptElements[0]);
    }

    private loadDataFromScript(scriptElement: HTMLScriptElement): Promise<string> {
        return new Promise((resolve, reject) => {
            if (scriptElement.src === '') {
                resolve(scriptElement.innerText);
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", scriptElement.src)
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        } else {
                            reject(`${xhr.status} ${xhr.statusText}`);
                        }
                    }
                };
                xhr.send();
            }
        });
    }

    private getScriptElements(type: string, id?: string): HTMLScriptElement[] {
        const scriptElements: HTMLScriptElement[] = [];
        for (let i = 0; i < this.scriptElements.length; i++) {
            const el = this.scriptElements[i];
            if (el instanceof HTMLScriptElement) {
                if ((el.type === type) && ((id === undefined) || (el.id === id))) {
                    scriptElements.push(el);
                }
            }
        }
        return scriptElements;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "chartjs-v4": ChartJS4;
    }
}
