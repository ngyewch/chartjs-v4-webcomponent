[![npm](https://img.shields.io/npm/v/@ngyewch/chartjs-v4-webcomponent)](https://www.npmjs.com/package/@ngyewch/chartjs-v4-webcomponent)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ngyewch/chartjs-v4-webcomponent/CI.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/ngyewch/chartjs-v4-webcomponent)

# chartjs-v4-webcomponent

Simple web component for displaying [Chart.js](https://www.chartjs.org/) v4 charts.

## Usage

### Import

Script tag:
```
<script type="module" src="https://cdn.jsdelivr.net/npm/@ngyewch/chartjs-v4-webcomponent@0.3.0/dist/chartjs-v4-webcomponent.js"></script>
```

### Markup

```
    <chartjs-v4>
        <script type="application/json">
            {
                "type": "bar",
                "data": {
                    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                    "datasets": [
                        {
                            "label": "My First Dataset",
                            "data": [65, 59, 80, 81, 56, 55, 40]
                        }
                    ]
                },
                "options": {
                    "maintainAspectRatio": false,
                    "scales": {
                        "y": {
                            "beginAtZero": true
                        }
                    }
                }
            }
        </script>
    </chartjs-v4>
```