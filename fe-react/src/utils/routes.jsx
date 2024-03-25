

export default function Router() {
    const getLocalStore = localStorage.getItem('userFormToken');
    const authorities = getLocalStore && JSON.parse(getLocalStore).authorities[0].authority;

    // const layoutElement =
    // authorities === 'ROLE_ADMIN' || authorities === 'ROLE_STAFF' ? <DashboardLayout /> : <DashboardLayoutClient />;




}