import React from "react";
// import { RazorpayPaymentGateWaySubscription } from "../PaymentGateWay/PaymentGatewWay";


function SubscribeToServicePage() {
    function MonthlyPayment() {
        console.log('Monthly Payment clicked');
    }
    function YearlyPayment() {
        console.log('Yearly Payment clicked');
    }
    return (
        <div>
            <div 
            className="subscribe-screen">
                <div className="subs-card">
                    <form onSubmit={() => MonthlyPayment()}>
                         <h3 className="subs-title">Monthly Subscription</h3>
                    </form>
                </div>
                <div className="subs-card">
                    <form onSubmit={(e) => YearlyPayment()}>
                        <h3 className="subs-title">Yearly Subscription</h3>
                    </form>                
                </div>
            </div>
        </div>
    )
}

export default SubscribeToServicePage;