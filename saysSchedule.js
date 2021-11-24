const { google } = require('googleapis');
const { getAuthClient } = require('./googleAuth');

const getApiClient = async () => {
  const authClient = await getAuthClient();
  const { spreadsheets: apiClient } = google.sheets({
    version : 'v4',
    auth    : authClient,
  });

  return apiClient;
};

const getValuesData = async (apiClient, range) => {
  const { data } = await apiClient.get({
    spreadsheetId   : '1NdoeXD6QXh-Q3uaWAz8m_7IQa5BHR5gwyZU5PSNvrPM',
    ranges          : range,
    fields          : 'sheets',
    includeGridData : true,
  });

  return data.sheets;
};

const findRowIndex = (sheet, message) => {
  const rowIndex = sheet.data[0].rowData.findIndex((item) => (
    item.values[0].formattedValue === message
  ));

  return rowIndex;
};

const setArrayResults = (data) => {
  const arrayResults = [];
  data.forEach((item, i) => {
    i !== 0 && item.hasOwnProperty('formattedValue') && arrayResults.push(item.formattedValue);
  });

  return arrayResults;
};

const prettifyText = (arratText) => {
  const updatedData = arratText.map((text) => {
    const parsedText = text.split(' > ');
    parsedText[0] = `\n<b>${parsedText[0]}:</b>\n`;

    return parsedText.join('');
  });

  return updatedData.join('');
};

const saysSchedule = async (ctx, danceInfo) => {
  const apiClient = await getApiClient();
  const [sheet] = await getValuesData(apiClient, danceInfo.get('danceType'));
  const rowIndex = findRowIndex(sheet, danceInfo.get('day'));

  if (rowIndex) {
    const lessons = setArrayResults(sheet.data[0].rowData[rowIndex].values);
    ctx.replyWithHTML(`У цей день проводять заняття:\n${prettifyText(lessons)}`);
  } else {
    ctx.reply('Спробуй пошукати інший день.');
  }
};

module.exports = {
  saysSchedule,
};
