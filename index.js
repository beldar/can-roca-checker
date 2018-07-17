const puppeteer = require('puppeteer');
const sendMail = require('./mail');

const URL = "https://www.covermanager.com/reservation/module_restaurant/celler-de-can-roca/spanish";
const CERRADO = "Cerrado";
const COMPLETO = "Completo. No hay disponibilidad para este día.";
const MAIL_TEXT = `Availability found! \nBook your table here: ${URL}`;

const tdSel = ".ui-datepicker-calendar td:not(.ui-state-disabled)";
const monthSel = ".ui-datepicker-title";
const horasSel = "#horas";

const wait = time => new Promise(resolve => {
  setTimeout(() => resolve(), time)
});

const parseCell = (cell, page, month) => {
  let day, status;
  return cell.click()
    .then(() => cell.$eval('a', node => node.innerText))
    .then(d => {
      day = d;
      console.log(d);
    })
    .then(() => wait(1000))
    .then(() => page.$eval(horasSel, node => node.innerText))
    .then(s => {
      status = s;
      if (status !== CERRADO && status !== COMPLETO) {
        sendMail(`Availability for the ${day} of ${month}`, MAIL_TEXT);
        console.warn('Availability!!');
      }
      console.log(s);
    });
};


(async () => {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.waitFor(tdSel);
  await page.waitFor(horasSel);
  const month = await page.$eval(monthSel, node => node.innerText);
  console.log(`Month: ${month}`);
  let cells = await page.$$(tdSel);
  for(var i = 0;i < cells.length;i++) {
    await parseCell(cells[i], page, month);
    cells = await page.$$(tdSel);
  }
  await browser.close();
})();
