
module.exports = {
    publicPath: '',
    css: {
        loaderOptions: {
            sass: {
            data: `
                @import "@/scss/_base.scss";
                $production: ${process.env.NODE_ENV === 'production' ? 'true' : 'false'};
                `
            },
        },
    },
};
