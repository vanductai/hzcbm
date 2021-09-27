module.exports = function (req, res, next) {
    const exclude_keys = ['skip', 'page', 'limit', 'sort_by', 'sort_type', 'updated_at', 'lastModifiedTime', 'nextHandle', 'modified_time', 'modifiedDate', 'is_master'];
    const BaseController = {
        getPaging: function (defaultSortBy = 'dateCreated', defaultSortType = '-1', isGetAll = false) {

            let defaultPage = 1;
            let defaultLimit = 1000;

            const queryData = req.query;
            let pagingInformation = {
                page: defaultPage,
                limit: defaultLimit,
                sort_by: defaultSortBy,
                sort_type: defaultSortType
            };

            if (queryData.hasOwnProperty('page')) {
                pagingInformation.page = parseInt(queryData.page) || defaultPage;
            }

            if (queryData.hasOwnProperty('limit')) {
                pagingInformation.limit = parseInt(queryData.limit) || defaultLimit;
            }

            if (queryData.hasOwnProperty('sort_by') && queryData.sort_by != '') {
                pagingInformation.sort_by = queryData.sort_by;
            }

            if (queryData.hasOwnProperty('sort_type') && queryData.sort_type != '') {
                pagingInformation.sort_type = queryData.sort_type;
            }
            if (!isGetAll) {
                pagingInformation.offset = (pagingInformation.page - 1) * pagingInformation.limit;
            }

            return pagingInformation;
        },

        getFilterConditions: function () {
            var condition = {
                $and: [

                ]
            };
            Object.keys(req.query).forEach(key => {
                if (!exclude_keys.includes(key)) {
                    var object = {};
                    object[key] = req.query[key];
                    condition.$and.push(object)
                }
            });

            if (req.query.hasOwnProperty('lastModifiedTime')) {
                condition.$and.push({
                    updatedAt: { $gte: new Date(new Number(req.query.lastModifiedTime)).getTime() }
                });
            }

            if (req.query.hasOwnProperty('modified_time')) {
                condition.$and.push({
                    modified_time: { $gte: new Date(req.query.modified_time) }
                });
            }

            if (req.query.hasOwnProperty('modifiedDate')) {
                condition.$and.push({
                    modifiedDate: { $gte: new Date(req.query.modifiedDate) }
                });
            }
            
            console.log(`Request filter: ${JSON.stringify(condition)}`);
            return condition;
        },

        renderError: function (error, statusCode = 500, isNext = true) {
            console.log(JSON.stringify(error));
            res.send(statusCode, error);
            if (isNext) {
                // return next(false);
                return next();
            }
        },

        renderResponse: function (data, statusCode = 200, isNext = true) {
            res.send(statusCode, data);
            if (isNext) {
                // return next(false);
                return next();
            }
        },

        getZohoBody: function () {
            var requestParams = undefined;
            if (req.method.toUpperCase() == 'GET' || req.method.toUpperCase() == 'DELETE') {
                requestParams = req.query;
            } else if (req.method.toUpperCase() == 'POST' || req.method.toUpperCase() == 'PUT') {
                requestParams = req.params;
            }
            if (requestParams != undefined) {
                requestParams = requestParams.JSONString;
                try {
                    return JSON.parse(requestParams);
                    // return JSON.parse(Utilities.urldecode(requestParams));
                } catch (error) {
                    return undefined;
                }
            } else {
                return undefined;
            }
        }
    };

    return BaseController;
};