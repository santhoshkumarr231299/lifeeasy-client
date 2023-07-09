
function getSideBarData() {
    return sideBarMenus;
}

interface menu {
    name : string,
    url : string,
}

const sideBarMenus : menu[]  = [
    {
        name : 'Subscription Rate',
        url : '/subscription-rate'
    },
]

export { getSideBarData, menu };