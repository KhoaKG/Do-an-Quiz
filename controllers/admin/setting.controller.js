const SettingGeneral = require("../../model/setting-general.model")
module.exports.general = async (req, res) => {
	const settingGeneral = await SettingGeneral.findOne({})
    res.render("admin/pages/settings/general", {
        pageTitle: "Trang cài đặt",
    	settingGeneral: settingGeneral
	})
}

module.exports.generalPatch = async (req, res) => {
	const settingGeneral = await SettingGeneral.findOne({})
	if (settingGeneral) {
    	await SettingGeneral.updateOne({
            _id: settingGeneral.id
    	}, req.body)
	} else {
    	const records = new SettingGeneral(req.body)
    	await records.save()
	}
 
    req.flash("success", "Cập nhật thành công")
    res.redirect("back")
}
