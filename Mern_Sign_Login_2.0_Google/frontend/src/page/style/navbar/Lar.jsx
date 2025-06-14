import cookie from "js-cookie";

const NavId = () => {
  const usersDataToken = cookie.get("usersdatatoken");
  return usersDataToken ? `/dash/${usersDataToken}` : "/login";
};

const ForId = () => {
  const usersDataToken = cookie.get("usersdatatoken");
  return usersDataToken ? `/forget/${usersDataToken}` : "/login";
};

const AdminId = () => {
  const usersDataToken = cookie.get("usersdatatoken");
  return usersDataToken ? `/admin/${usersDataToken}` : "/login";
};

const GoogleId = () => {
  const usersDataToken = cookie.get("usersdatatoken");
  return usersDataToken ? `/google/${usersDataToken}` : "/login";
};

function Lar() {
  return <div></div>;
}

export { AdminId, ForId, GoogleId, Lar, NavId };
