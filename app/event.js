class Event {
    static addEvent(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        if (uploadedFile) {
            data.append('image', uploadedFile, uploadedFile.name);
            uploadedFile = null;
        }
        data.append('description', quill.root.innerHTML);
        axios.post(`/events`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                location.href = 'adminEvent.html';
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static updateEvent(form, eventId) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        if (uploadedFile) {
            data.append('image', uploadedFile, uploadedFile.name);
            uploadedFile = null;
        }
        data.append('description', quill.root.innerHTML);
        axios.put(`/events/${eventId}`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success('Event has been updated successfully')
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static getEvents() {
        $('.loading-overlay').show();
        axios.get(`/events`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const eventsContainer = $('#events-container');
                eventsContainer.empty();
                response.data.forEach(event => {
                    eventsContainer.append(eventCard(event));
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async getEventDetails(eventId) {
        $('.loading-overlay').show();
        axios.get(`/events/${eventId}`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const event = response.data;
                $('.event-name').text(event.title).val(event.title);
                $('.event-shortDescription').val(event.shortDescription);
                $('.event-date').val(event.eventDate);
                $('.event-time').val(event.eventTime);
                $('.event-location').val(event.location);
                $('.event-locationDetails').val(event.locationDetails);
                $('.event-latitude').val(event.latitude);
                $('.event-longitude').val(event.longitude);
                quill.root.innerHTML = event.description;
                if (event.image) {
                    $('.event-image').empty().append(`<img src="${event.image}" alt="Event Image"/>`);
                }
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }
}

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('event');


try {
    const autocomplete = new google.maps.places.Autocomplete(document.querySelector('input[name="location"]'));
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        console.log(place)
        document.querySelector('input[name="locationDetails"]').value = place.name + ', ' + place.formatted_address;
        document.querySelector('input[name="latitude"]').value = place.geometry.location.lat();
        document.querySelector('input[name="longitude"]').value = place.geometry.location.lng();
    });
} catch (e) {
    console.log(e);
}

const eventForm = $('#event-form');
eventForm.on('submit', (e) => {
    e.preventDefault();
    Event.addEvent(eventForm);
});

const updateEventForm = $('#update-event-form');
updateEventForm.on('submit', (e) => {
    e.preventDefault();
    Event.updateEvent(updateEventForm, eventId);
});

$(document).ready(() => {
    Event.getEvents();

    if (eventId) {
        Event.getEventDetails(eventId);
    }
});

const eventCard = (event) => {
    const eventTime = `2020-01-01 ${event.eventTime}`;
    return `
     <div class="event-post mb-3 py-4 px-4">
        <div class="row">
            <!--Event Image-->
            <div class="col-sm-4">
                <img src="${event.image}" alt="event-img" class="img-fluid">
            </div>
            <!--Event Details-->
            <div class="col-sm-8">
                <a href="#">
                    <h2 class="eventName">${event.title}</h2>
                </a>
                <p class="text-muted">
                    <span class="mr-3"><i class="far fa-calendar-alt mr-1">${moment(event.eventDate).format('MMMM Do YYYY')}</i></span>
                    <span><i class="far fa-clock mr-1"></i>${moment(eventTime).format('h:mm a')}</span>
                </p>
                <p class="text-muted">
                    <span><i class="fas fa-map-marked-alt mr-2"></i>${event.locationDetails}</span>
                </p>
                <div class="row tickets">
                    <div class="col-md-8">
                        <p>
                            <span class="mr-2"><i class="fas fa-ticket-alt"></i></span>
                            30 RSVPs (STATIC TODO)
                        </p>
                    </div>

                    <div class="col-md-4 mr-auto">
                        <a href="adminEditEvent.html?event=${event.id}">
                            <button class="btn btn-success">Details</button>
                        </a>
                        <a href="#">
                            <button class="btn btn-success" data-toggle="modal" data-target="#cancelEvent">Cancel</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};
