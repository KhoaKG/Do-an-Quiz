module.exports.index = (req, res) => {
    res.render('client/pages/home/index', { title: 'Hey', message: 'Hello Home!' })
}