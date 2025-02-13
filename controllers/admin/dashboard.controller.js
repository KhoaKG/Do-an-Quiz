module.exports.index = (req, res) => {
    res.render('admin/pages/dashboard/index', { title: 'Hey', message: 'Hello Home!' })
}