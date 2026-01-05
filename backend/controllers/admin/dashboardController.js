const Booking = require('../../models/Booking');
const Movie = require('../../models/Movie');
const Showtime = require('../../models/Showtime');
const User = require('../../models/User');
const Room = require('../../models/Room');
const Theater = require('../../models/Theater');

const calculateRevenue = async (startDate, endDate) => {
    const bookings = await Booking.find({
        status: 'success',
        createdAt: { $gte: startDate, $lte: endDate }
    });
    return bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
};

const getDashboardStats = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        const now = new Date();
        let startDate = new Date();
        
        switch(period) {
            case 'day':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        const revenue = await calculateRevenue(startDate, now);

        const totalTickets = await Booking.countDocuments({
            status: 'success',
            createdAt: { $gte: startDate, $lte: now }
        });

        const totalUsers = await User.countDocuments();
        
        const activeMovies = await Showtime.distinct('movie', {
            startTime: { $gte: now }
        });

        const topMoviesByRevenue = await Booking.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: startDate, $lte: now }
                }
            },
            {
                $lookup: {
                    from: 'showtimes',
                    localField: 'showtime',
                    foreignField: '_id',
                    as: 'showtimeData'
                }
            },
            { $unwind: '$showtimeData' },
            {
                $lookup: {
                    from: 'movies',
                    localField: 'showtimeData.movie',
                    foreignField: '_id',
                    as: 'movieData'
                }
            },
            { $unwind: '$movieData' },
            {
                $group: {
                    _id: '$movieData._id',
                    title: { $first: '$movieData.title' },
                    posterUrl: { $first: '$movieData.posterUrl' },
                    totalRevenue: { $sum: '$totalPrice' },
                    totalTickets: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        const pastShowtimes = await Showtime.find({
            startTime: { $lte: now },
            endTime: { $gte: startDate }
        });

        let totalSeats = 0;
        let bookedSeats = 0;

        pastShowtimes.forEach(showtime => {
            showtime.seats.forEach(seat => {
                totalSeats++;
                if (seat.status === 'booked') {
                    bookedSeats++;
                }
            });
        });

        const occupancyRate = totalSeats > 0 ? ((bookedSeats / totalSeats) * 100).toFixed(2) : 0;

        const revenueByDay = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date();
            dayStart.setDate(now.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayRevenue = await calculateRevenue(dayStart, dayEnd);
            
            revenueByDay.push({
                date: dayStart.toISOString().split('T')[0],
                revenue: dayRevenue
            });
        }

        const theaterStats = await Booking.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: startDate, $lte: now }
                }
            },
            {
                $lookup: {
                    from: 'showtimes',
                    localField: 'showtime',
                    foreignField: '_id',
                    as: 'showtimeData'
                }
            },
            { $unwind: '$showtimeData' },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'showtimeData.room',
                    foreignField: '_id',
                    as: 'roomData'
                }
            },
            { $unwind: '$roomData' },
            {
                $lookup: {
                    from: 'theaters',
                    localField: 'roomData.theater',
                    foreignField: '_id',
                    as: 'theaterData'
                }
            },
            { $unwind: '$theaterData' },
            {
                $group: {
                    _id: '$theaterData._id',
                    name: { $first: '$theaterData.name' },
                    totalRevenue: { $sum: '$totalPrice' },
                    totalTickets: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        const bookingsByStatus = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            stats: {
                revenue,
                totalTickets,
                totalUsers,
                activeMovies: activeMovies.length,
                occupancyRate: parseFloat(occupancyRate)
            },
            topMovies: topMoviesByRevenue,
            revenueByDay,
            theaterStats,
            bookingsByStatus,
            period
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ msg: 'Lỗi khi lấy thống kê dashboard' });
    }
};

const getQuickStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalTheaters = await Theater.countDocuments();
        const totalBookings = await Booking.countDocuments({ status: 'success' });

        res.status(200).json({
            totalUsers,
            totalMovies,
            totalTheaters,
            totalBookings
        });
    } catch (error) {
        console.error('Quick stats error:', error);
        res.status(500).json({ msg: 'Lỗi khi lấy thống kê nhanh' });
    }
};

module.exports = {
    getDashboardStats,
    getQuickStats
};
