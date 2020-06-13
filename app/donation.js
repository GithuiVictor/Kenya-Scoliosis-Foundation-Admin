class Donation {
    static getDonations() {
        $('.loading-overlay').show();
        axios.get(`/donations`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const donationsContainer = $('#donations-container');
                donationsContainer.empty();

                response.data.forEach(donation => {
                    donationsContainer.append(donationTemp(donation));
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }
}

const donationTemp = (donation) => {
    return `
        <tr>
            <td>${donation.name}</td>
            <td>${donation.email}</td>
            <td>KES ${donation.payment && donation.payment.amount || ''}</td>
            <td>
                <a href="adminMessage.html">
                    <button type="button" class="btn btn-success btn-sm">
                        Message
                    </button>
                </a>
            </td>
        </tr>
    `;
};

$(document).ready(() => {
    Donation.getDonations();
});
