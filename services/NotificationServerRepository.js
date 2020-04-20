
PUSH_ENDPOINT = 'https://subsuke-notification-server.herokuapp.com/notification';

export function registNotification(additional, insertId) {
  return fetch(
    PUSH_ENDPOINT,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: additional.token,
        },
        user: {
          username: 'anonymous',
        },
        notification: {
          message: 'もうすぐ'+additional.service+'のお支払日です．',
          cycle: additional.cycle,
          date: additional.due,
          rowid: insertId,
        },
      })
    }
  );
}

export function deleteNotification(rowid, token) {
  fetch(PUSH_ENDPOINT+'/'+rowid+':'+token, {
    method: 'DELETE',
  });
}