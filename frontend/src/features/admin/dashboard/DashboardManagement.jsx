import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { 
  TrendingUp, 
  Users, 
  Ticket, 
  Film, 
  DollarSign, 
  Calendar,
  Percent,
  Building,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const DashboardManagement = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getDashboardStats(period);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Lỗi khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500"
    };

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              {trend && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div className={`${colorClasses[color]} p-3 rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan và thống kê hệ thống</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="day">Hôm nay</TabsTrigger>
            <TabsTrigger value="week">7 ngày</TabsTrigger>
            <TabsTrigger value="month">30 ngày</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Tổng Doanh Thu"
          value={formatCurrency(stats?.stats?.revenue || 0)}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Vé Đã Bán"
          value={stats?.stats?.totalTickets || 0}
          icon={Ticket}
          color="blue"
        />
        <StatCard
          title="Người Dùng"
          value={stats?.stats?.totalUsers || 0}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Phim Đang Chiếu"
          value={stats?.stats?.activeMovies || 0}
          icon={Film}
          color="orange"
        />
      </div>

      {/* Occupancy Rate */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Tỉ Lệ Lấp Đầy Phòng Chiếu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-gray-900">{stats?.stats?.occupancyRate}%</span>
              <Badge variant={stats?.stats?.occupancyRate > 70 ? "default" : "secondary"}>
                {stats?.stats?.occupancyRate > 70 ? "Tốt" : "Trung bình"}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${stats?.stats?.occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Doanh Thu 7 Ngày Gần Nhất
          </CardTitle>
          <CardDescription>Biểu đồ doanh thu theo ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.revenueByDay?.map((day, index) => {
              const maxRevenue = Math.max(...(stats.revenueByDay.map(d => d.revenue) || [1]));
              const percentage = (day.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{new Date(day.date).toLocaleDateString('vi-VN')}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(day.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Movies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-5 h-5" />
              Top 5 Phim Doanh Thu Cao Nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topMovies?.length > 0 ? (
                stats.topMovies.map((movie, index) => (
                  <div key={movie._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-shrink-0">
                      <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                    </div>
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{movie.title}</p>
                      <p className="text-sm text-gray-600">{movie.totalTickets} vé</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(movie.totalRevenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Theater Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Thống Kê Theo Rạp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.theaterStats?.length > 0 ? (
                stats.theaterStats.map((theater, index) => (
                  <div key={theater._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-semibold text-gray-900">{theater.name}</p>
                        <p className="text-sm text-gray-600">{theater.totalTickets} vé</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{formatCurrency(theater.totalRevenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Trạng Thái Đặt Vé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats?.bookingsByStatus?.map((status) => {
              const statusConfig = {
                success: { label: 'Thành công', color: 'bg-green-100 text-green-800' },
                pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
                failed: { label: 'Thất bại', color: 'bg-red-100 text-red-800' },
                expired: { label: 'Hết hạn', color: 'bg-gray-100 text-gray-800' }
              };
              
              const config = statusConfig[status._id] || { label: status._id, color: 'bg-gray-100' };
              
              return (
                <div key={status._id} className={`p-4 rounded-lg ${config.color}`}>
                  <p className="text-sm font-medium mb-1">{config.label}</p>
                  <p className="text-2xl font-bold">{status.count}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardManagement;

