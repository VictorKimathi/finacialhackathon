"use client";

import { useAuth } from '../../provider/auth-provider';
import axios from 'axios';
import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "../../../../react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import "../../../../react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import { useRouter } from "next/navigation";

// Importing relevant Material-UI icons
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FraudDetectionOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

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
            icon={isCollapsed ? <DashboardOutlinedIcon /> : undefined}
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
                  <DashboardOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Dashboard Items */}
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<DashboardOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FINAC AI"
              to="/dashboard/scenes/ai"
              icon={<LightbulbOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="AI HUB"
              to="/dashboard/scenes/hub"
              icon={<HubOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Reminder"
              to="/dashboard/scenes/reminder"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Notifications"
              to="/dashboard/scenes/notifications"
              icon={<NotificationsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Inputs"
              to="/dashboard/scenes/majorinputs"
              icon={<PeopleAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Surprise Me"
              to="/dashboard/scenes/surpriseme"
              icon={<EmojiObjectsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Credit Score"
              to="/dashboard/scenes/creditScore"
              icon={<CreditScoreOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Investment Advice"
              to="/dashboard/scenes/investadvice"
              icon={<AttachMoneyOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Settings */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Site Settings
            </Typography>
            <Item
              title="Fair"
              to="/dashboard/scenes/fair"
              icon={<SettingsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Plaid"
              to="/dashboard/scenes/plaid"
              icon={<ReceiptLongOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="OverPriced Shop"
              to="/dashboard/scenes/overpriced"
              icon={<ShoppingCartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Pages */}
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
              icon={<FraudDetectionOutlinedIcon />}
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
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
