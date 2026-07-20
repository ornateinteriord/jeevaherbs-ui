import { CheckCircle2Icon, PackageIcon } from "lucide-react";
import { SideBarMenuItemType } from "../../store/store";
import {
  DashboardIcon,
  AccountCircleIcon,
  CheckCircleIcon,
  GroupIcon,
  ShowChartIcon,
  CreditCardIcon,
  MailOutlineIcon,
  PersonIcon,
  VerifiedUserIcon,
  LockIcon,
  PeopleIcon,
  AccountTreeIcon,
  PersonAddIcon,
  PaymentsIcon,
  SupportIcon,
  AnnouncementIcon,
  EventIcon,
  SmsIcon,
} from "../Icons";
import { CardMembershipRounded, Pending } from "@mui/icons-material";

export const UserSideBarMenuItems: SideBarMenuItemType[] = [
  {
    name: "My Dashboard",
    icon: <DashboardIcon />,
    path: "/user/dashboard",
    isExpandable: false,
  },
  {
    name: "Account Settings",
    icon: <AccountCircleIcon />,
    isExpandable: true,
    subItems: [
      { name: "My Profile", path: "/user/account/profile", icon: <PersonIcon /> },
      { name: "KYC Verification", path: "/user/account/kyc", icon: <VerifiedUserIcon /> },
      {
        name: "Update Password",
        path: "/user/account/change-password",
        icon: <LockIcon />,
      },
    ],
  },
  {
    name: "My Team",
    icon: <GroupIcon />,
    isExpandable: true,
    subItems: [
      { name: "Direct Referrals", path: "/user/team/direct", icon: <PeopleIcon /> },
      { name: "Team View", path: "/user/team", icon: <GroupIcon /> },
      { name: "Team Tree", path: "/user/team/tree", icon: <AccountTreeIcon /> },
      {
        name: "New Registration",
        path: "/user/team/new-register",
        icon: <PersonAddIcon />,
      },
    ],
  },
  /* {
    name: "My Earnings",
    icon: <MonetizationOnIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Direct Income",
        path: "/user/income/direct",
        icon: <TrendingUpIcon />,
      },
      {
        name: "Level Income",
        path: "/user/income/level",
        icon: <TrendingUpIcon />,
      },
      {
        name: "Daily ROI",
        path: "/user/income/daily-roi",
        icon: <PaymentsIcon />,
      },
      {
        name: "Daily Incentive",
        path: "/user/income/daily-incentive",
        icon: <PaymentsIcon />,
      },
      {
        name: "Reward",
        path: "/user/income/global",
        icon: <ShowChartIcon />,
      },
      {
        name: "Total Earnings",
        path: "/user/earnings",
        icon: <PaymentsIcon />,
      },
    ],
  }, */
  {
    name: "My Transactions",
    icon: <ShowChartIcon />,
    path: "/user/transactions",
    isExpandable: false,
    /* subItems: [
      {
        name: "Wallet History",
        path: "/user/transactions",
        icon: <CreditCardIcon />,
      },
      {
        name: "Loan Details",
        path: "/user/loantransactions",
        icon: <AccountBalance />,
      },
    ], */
  },
  {
    name: "Wallet Summary",
    icon: <CreditCardIcon />,
    path: "/user/wallet",
    isExpandable: false,
  },
  {
    name: "My Messages",
    icon: <MailOutlineIcon />,
    path: "/user/mailbox",
    isExpandable: false,
  },
];

export const AdminSideBarMenuItems: SideBarMenuItemType[] = [
  {
    name: "Admin Dashboard",
    icon: <DashboardIcon />,
    path: "/admin/dashboard",
    isExpandable: false,
  },
  {
    name: "Member Management",
    icon: <GroupIcon />,
    isExpandable: true,
    subItems: [
      { name: "All Members", path: "/admin/members", icon: <PeopleIcon /> },
      {
        name: "Pending Approvals",
        path: "/admin/members/pending",
        icon: <PersonAddIcon />,
      },
      {
        name: "Active Users",
        path: "/admin/members/active",
        icon: <CheckCircleIcon />,
      },
      {
        name: "Inactive Users",
        path: "/admin/members/inactive",
        icon: <PersonIcon />,
      },
      {
        name: "KYC Review",
        path: "/admin/kyc-approval",
        icon: <VerifiedUserIcon />,
      },
    ],
  },
   {
    name: "Activation Center", 
    icon: <DashboardIcon />,
    isExpandable: true, 
    subItems: [
      {
        name: "User Activation",
        icon: <CheckCircle2Icon />,
        path: "/admin/Activate",
      },
      {
        name: "Package Activation",
        icon: <PackageIcon />,
        path: "/admin/ActivatePackage",
      },
    ],
  },
  /* {
    name: "Income Management",
    icon: <MonetizationOnIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Direct Income",
        path: "/admin/income/direct",
        icon: <PaymentsIcon />,
      },
      {
        name: "Level Income",
        path: "/admin/income/level",
        icon: <TrendingUpIcon />,
      },
      {
        name: "Daily ROI",
        path: "/admin/income/daily-roi",
        icon: <PaymentsIcon />,
      },
      {
        name: "Daily Incentive",
        path: "/admin/income/daily-incentive",
        icon: <PaymentsIcon />,
      },
      {
        name: "Reward",
        path: "/admin/income/reward",
        icon: <ShowChartIcon />,
      },
      {
        name: "Total Earnings",
        path: "/admin/income/total-earnings",
        icon: <PaymentsIcon />,
      },
      {
        name: "Total Withdraws",
        path: "/admin/income/total-withdraws",
        icon: <PaymentsIcon />,
      },
      {
        name: "Wallet Balance",
        path: "/admin/income/wallet-balance",
        icon: <AccountBalance />,
      },
    ],
  }, */

{
  name: "Loan Services",
  icon: <CreditCardIcon />,
  isExpandable: true,
  subItems: [
    { 
      name: "Pending Applications", 
      path: "/admin/member/pending", 
      icon: <Pending/> 
    },
    { 
      name: "Processed Loans", 
      path: "/admin/member/processed", 
      icon: <CardMembershipRounded /> 
    },
   
  ],
},
{
  name: "Repayment Tracking",
  icon: <PaymentsIcon />,
  isExpandable: true,
  subItems: [
    { 
      name: "Repayment Records", 
      path: "/admin/repayments/list", 
      icon: <PaymentsIcon /> 
    },
  ],
},


  {
    name: "Payout Processing",
    icon: <CreditCardIcon />,
    path: "/admin/payout",
    isExpandable: false,
  },
  {
    name: "Withdrawal Requests",
    icon: <Pending />,
    path: "/admin/withdraw-pending",
    isExpandable: false,
  },
  {
    name: "Transaction Records",
    icon: <ShowChartIcon />,
    isExpandable: true,
    subItems: [
      {
        name: "Financial Transactions",
        path: "/admin/transactions",
        icon: <ShowChartIcon />,
      },
      {
        name: "SMS Logs",
        path: "/admin/transactions/sms",
        icon: <SmsIcon />,
      },
    ],
  },
  {
    name: "Support Center",
    path: "/admin/support-tickets",
    icon: <SupportIcon />,
    isExpandable: false,
  },
  {
    name: "News & Updates",
    path: "/admin/news",
    icon: <AnnouncementIcon />,
    isExpandable: false,
  },
  {
    name: "Holiday Calendar",
    path: "/admin/holidays",
    icon: <EventIcon />,
    isExpandable: false,
  },
];