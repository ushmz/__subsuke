export default totalCost = (items) => {
  var weekly = 0;
  var monthly = 0;
  var yearly = 0;

  if ((items.length) !== 0 ) {
    items._array.forEach((current) => {
      if (current.cycle === '週') {
        weekly += parseInt(current.price);
        monthly += parseInt(current.price*4);
        yearly += parseInt(current.price*4*12);
      } else if (current.cycle === '月') {
        weekly += parseInt(current.price/4);
        monthly += parseInt(current.price);
        yearly += parseInt(current.price*12);
      } else if (current.cycle === '年') {
        weekly += parseInt(current.price/12/4);
        monthly += parseInt(current.price/12);
        yearly += parseInt(current.price);
      }
    });
  }
  return {'weekly': weekly, 'monthly': monthly, 'yearly': yearly}
}
