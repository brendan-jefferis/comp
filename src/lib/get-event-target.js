export default function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}