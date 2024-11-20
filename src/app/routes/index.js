const express = require("express");
const router = express.Router();
const AuthRoutes = require("../module/auth/auth.routes");
const AdminRoutes = require("../module/admin/admin.routes");
const UserRoutes = require("../module/user/user.routes");
const DashboardRoutes = require("../module/dashboard/dashboard.routes");
const ManageRoutes = require("../module/manage/manage.routes");
const CarRoutes = require("../module/car/car.routes");
const TripRoutes = require("../module/trip/trip.routes");
const FeedbackRoutes = require("../module/feedback/feedback.routes");
const ReviewRoutes = require("../module/review/review.routes");
const FavoriteRoutes = require("../module/favorite/favorite.routes");
const ChatRoutes = require("../module/chat/chat.routes");
const PaymentRoutes = require("../module/payment/payment.routes");

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/manage",
    route: ManageRoutes,
  },
  {
    path: "/car",
    route: CarRoutes,
  },
  {
    path: "/trip",
    route: TripRoutes,
  },
  {
    path: "/feedback",
    route: FeedbackRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/favorite",
    route: FavoriteRoutes,
  },
  {
    path: "/chat",
    route: ChatRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
