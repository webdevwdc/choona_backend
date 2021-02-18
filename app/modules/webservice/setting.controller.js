const settingRepo = require('setting/repositories/setting.repository');

/* 
// @Method: getSettingBySlug
// @Description: Get Setting data By Slug
*/
exports.getAllSetting = async req => {
    try {
        const settingData = await settingRepo.getAllByField({status: 'Active', isDeleted: false });
        if(settingData){
            return { status: 200, data: settingData, message: 'Setting Data fetched Successfully' };
        } else{
            return { status: 201, data: [], message: 'No Data Found' };
        }
    } catch (error) {
        return { "status": 500, data:{}, "message": error.message }
    }
};