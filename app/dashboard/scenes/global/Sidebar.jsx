"use client";

import { useAuth } from '../../provider/auth-provider';

import axios from 'axios';
import { useEffect,useState } from "react";
// import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { ProSidebar, Menu, MenuItem } from "../../../../react-pro-sidebar";

import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import { Link } from "react-router-dom";
import "../../../../react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AssistantOutlinedIcon from '@mui/icons-material/AssistantOutlined';
import { useRouter } from "next/navigation";
import { base_url } from "../../../../env.js"


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const router = useRouter();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        router.push(to);
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [user , setUser] = useState(null)
  const [loading, setLoading] = useState(true); // Loading state

  const { getToken } = useAuth();  // Getting token from the auth provider

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//         try {
//             const response = await axios.get('http://localhost:8000/api/profileview', {
//                 headers: {
//                     "Authorization": `Token ${getToken()}`,
//                     "Content-Type": "application/json",
//                 },
//             });
//             console.log(response.data)
//             setUser(response.data); // Set the user data in state
//             setLoading(false); // Stop loading
//         } catch (error) {
//             console.log('Error fetching user profile:', error);
//             setLoading(false); // Stop loading in case of error
//         }
//     };

//     fetchUserProfile();
// }, [getToken]); // Run effect when component mounts and when token changes

// if (loading) {
//   return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
//           Loading...
//       </div>
//   );
// }

// if (!user) {
//   return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
//           Error loading user profile.
//       </div>
//   );
// }

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  FINACAI
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`/avatae.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {/* {user.name} */}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {/* {user.email} */}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="FINAC AI"
              to="/dashboard/scenes/ai"
              icon={<AssistantOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
     
         <Item
              title="AI HUB"
              to="/dashboard/scenes/hub"
              icon={<AssistantOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                  <Item
            title="Reminder"
             to="/dashboard/scenes/reminder"
             icon={<AssistantOutlinedIcon />}
             selected={selected}
          setSelected={setSelected}
           />

                <Item
              title="Notifications"
              to="/dashboard/scenes/notifications"
              icon={<AssistantOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                      <Item
              title="Manage Inputs"
              to="/dashboard/scenes/majorinputs"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                          <Item
              title="Surprise me "
              to="/dashboard/scenes/surpriseme"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                                      <Item
              title="Credit Score "
              to="/dashboard/scenes/creditScore"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                                     <Item
              title="Investment Advice"
              to="/dashboard/scenes/investadvice"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              site setting
            </Typography>
            {/* <Item
              title="Connect Bank"
              to="/dashboard/scenes/bankconnect"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Fair"
              to="/dashboard/scenes/fair"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                <Item
              title="Plaid"
              to="/dashboard/scenes/plaid"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="OverPriced Shop"
              to="/dashboard/scenes/overpriced"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Debts Management"
              to="/debts"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
              {/* <Item
              title="Input"
              to="/transactionform"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
                  <Item
              title="Fraud Detections"
              to="/fraud"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Fraud Detection"
              to="/dashboard/scenes/fraud"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/dashboard/scenes/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/dashboard/scenes/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Plaid
            </Typography>
            <Item
              title="FAQ Page"
              to="/dashboard/scenes/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />



            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            {/* 
            <Item
              title="Bar Chart"
              to="dashboard/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
