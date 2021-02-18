const settingRepo = require('setting/repositories/setting.repository');

exports.getSettingBySlug = async req => {
    try{
        const setting = await settingRepo.getByField({slug: req.params.slug, status: 'Active'});
        return { status: 200, data: setting, message: 'Setting fetched Successfully' };
    } catch (error) {
        return { "success": false, "status": 500, data: [], "message": 'Something went wrong' }
    }
};

exports.getSettingAll = async req => {
    try{
        const setting_data = await settingRepo.getAllSetting();
        
        var settingObj = {};
        if (!_.isEmpty(setting_data)) {
            setting_data.forEach(function(element) {
                settingObj[element.setting_name.replace(/\s+/g,"_")] = element.setting_value;
            });
        }
        return { status: 200, data: settingObj, message: 'Setting fetched Successfully' };
    } catch (error) {
        return { "success": false, "status": 500, data: [], "message": 'Something went wrong' }
    }
};
