/* JWT Authentication secret */
process.env.secret = 'fagG8AC7TuigoBgvyu9nw2GN1BvsPNfA';

/* *
    Set to 'yes' when updating from the linkups version that doesn't have
    ip pool management implemented. Otherwise leave as is. (DEFAULT = 'no')
    *** NOTE: THIS CONFIGURATION IS NOT REQUIRED IF THERE'S NO DATA IN DATABASE. ***
* */
process.env.updatingVersion = 'yes';