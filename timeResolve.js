//https://pontoweb.nasajon.com.br/radix/colaborador/ajustes/criar
module.exports = {
    default: async () =>  {
        ///////// Model

        class HourWorkTime {
            constructor(hour, justify) {
                this.hour = hour;
                this.justify = justify;
            }

            toRequestObject() {
                return {
                    marcacao: {
                        datahora: this.hour
                    },
                    justificativa: this.justify
                };
            }
        }

        class WorkTime {

            constructor(dateTarget) {
                this.dateTarget = dateTarget;
                this.hours = [];
            }

            appendHour(hour, justify) {
                this.hours.push(new HourWorkTime(hour, justify));
            }

            toRequestObject() {
                const formData = new FormData();
                formData.append('datareferencia', this.dateTarget);
                formData.append('diaponto[]', 'Atual');
                formData.append('diaponto[]', 'Atual');
                formData.append('diaponto[]', 'Atual');
                formData.append('diaponto[]', 'Atual');
                formData.append('form[ajustes][0][marcacao][datahora]', this.hours[0].hour);
                formData.append('form[ajustes][0][justificativa]', this.hours[0].justify);
                formData.append('form[ajustes][1][marcacao][datahora]', this.hours[1].hour);
                formData.append('form[ajustes][1][justificativa]', this.hours[1].justify);
                formData.append('form[ajustes][2][marcacao][datahora]', this.hours[2].hour);
                formData.append('form[ajustes][2][justificativa]', this.hours[2].justify);
                formData.append('form[ajustes][3][marcacao][datahora]', this.hours[3].hour);
                formData.append('form[ajustes][3][justificativa]', this.hours[3].justify);
                return formData;
            }

            toString() {
                return this.dateTarget;
            }
        }

        ///////// API

        const urlWorkTime = './ajustes/criar';

        function doRequest(request) {
            return Promise.resolve();
            // return fetch(request)
            //     .then(response => {
            //         const contentType = response.headers.get('content-type');
            //         return contentType === 'application/json' ? response.json() : response.text();
            //     });
        }

        function sendWorkTime(workTime) {
            const request = new Request(urlWorkTime, {
                method: 'POST',
                body: workTime.toRequestObject(),
            });
            return doRequest(request);
        }

        ///////// Service

        function randomMinute() {
            let minute = Math.ceil(Math.random() * 59);
            if (minute < 10) {
                return '0' + minute;
            } else {
                return minute.toString();
            }
        }

        function createWorkTime(date) {
            const workTime = new WorkTime(date);
            const minutesInOut = randomMinute();
            const minutesLunch = randomMinute();
            workTime.appendHour('09:' + minutesInOut, 'Alocado no cliente');
            workTime.appendHour('12:' + minutesLunch, 'Almoço saída');
            workTime.appendHour('13:' + minutesLunch, 'Almoço retorno');
            workTime.appendHour('18:' + minutesInOut, 'Final expediente');
            return workTime;
        }

        async function sendDates(dateList) {
            const workTimeList = dateList.map(createWorkTime);
            for (let workTime of workTimeList) {
                try {
                    console.info(`>>> ${workTime.toString()} Enviado com sucesso!`);
                    await sendWorkTime(workTime);
                } catch (e) {
                    console.error(`>>> ${workTime.toString()} Enviado com erro!`);
                    console.error(e);
                }
            }
        }

        ///////// View

        function getDataFromTable() {
            const tableRowsHtml = document.querySelectorAll('table#pendencias-table tbody tr');
            const dates = Array.from(tableRowsHtml)
                .filter(rowHtml => rowHtml.getElementsByTagName('td')[1])
                .filter(rowHtml => rowHtml.getElementsByTagName('td')[1].innerText == 'Ausência de marcação' && rowHtml.getAttribute("data-date"))
                .map(rowHtml => rowHtml.getAttribute("data-date"));
            return dates;
        }
        
        ///////// Execution
        console.info('============= START PROCESS =============');
        await sendDates(getDataFromTable())
            .then(() => console.info('============= END PROCESS ============='))
            .catch(() => console.error('============= END PROCESS WITH ERROR =============') || console.error(e))
    }
}