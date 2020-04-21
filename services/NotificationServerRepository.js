
LOCAL_ENDPOINT = 'http://127.0.0.1:5000/notification';
PUSH_ENDPOINT = 'https://subsuke-notification-server.herokuapp.com/notification';

export function registNotification(additional, insertId) {
  return fetch(
    LOCAL_ENDPOINT,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username: 'anonymous',
        },
        pushtoken: additional.token,
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

export function updateNotification(token, item) {
  return fetch(LOCAL_ENDPOINT+'/upd', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pushtoken: token,
      user: {
        username: 'anonymous',
      },
      notification: {
        rowid: item.rowid,
      },
      update: {
        message: `もうすぐ${item.service}のお支払日です`,
        cycle: item.cycle,
        next: `${item.year}-${item.month}-${item.date}`
      }
    })
  });
}

export function deleteNotification(rowid, token) {
  fetch(PUSH_ENDPOINT+'/'+rowid+':'+token, {
    method: 'DELETE',
  });
}