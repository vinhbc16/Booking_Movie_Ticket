import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CheckCircle, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center px-4">
            <div className="bg-[#1c1c2e] p-8 rounded-2xl border border-green-500/30 text-center max-w-md w-full shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-2">Thanh toán thành công!</h1>
                <p className="text-gray-400 mb-8">
                    Vé của bạn đã được xuất. Bạn có thể xem lại trong phần Vé của tôi hoặc Email.
                </p>

                <div className="space-y-3">
                    <Button 
                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
                        onClick={() => navigate('/my-tickets')}
                    >
                        <Ticket className="mr-2 w-5 h-5" /> Xem vé của tôi
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full text-gray-400 hover:text-white"
                        onClick={() => navigate('/')}
                    >
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}