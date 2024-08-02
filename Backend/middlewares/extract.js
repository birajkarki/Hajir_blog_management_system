const extractObj = (req, res, next) => {
  const paramObj = req.params;
  const body = req.body;
  const obj = { ...body };
  for (let key in paramObj) {
    obj[key] = paramObj[key];
  }
  req.obj = obj;
  console.log(obj);
  next();
};

export default extractObj;
