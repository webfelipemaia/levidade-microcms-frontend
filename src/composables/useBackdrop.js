
export function useAddBackDrop(modalId) {
    
    // get by modal Id
    const modalToOpen = document.querySelector(`.modal#${modalId}`);

    // add base styles to make the modal work
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    body.style.paddingRight = '15px';

    // get all modals
    const modals = document.getElementsByClassName('modal');
    
    // Search for modals and hide them                                                                                               
    Array.from(modals).forEach(modal => {
        modal.classList.remove('show');
        modal.style.display = 'none';
    });

    // displays one item only
    if (modalToOpen) {
        modalToOpen.classList.add('show');
        modalToOpen.style.display = 'block';
    }

    // create a new div
    const parentDiv = document.querySelector('.maincontent.container');
    const newDiv = document.createElement('div');
    newDiv.classList.add('modal-overlay', 'modal-content');
    parentDiv.appendChild(newDiv);
}
    
export function useRemoveBackDrop() {

    // removes styles that provide the basis for how the modal works
    document.body.style = ''
    const modal = document.querySelector('.modal.fade')
    modal.style =  ''
    modal.classList.remove('show')

    // get all modals
    const modals = document.getElementsByClassName('modal');
    
    // hide all modals
    Array.from(modals).forEach(modal => {
        modal.classList.remove('show');
        modal.style.display = 'none';
    });
    
    const parentDiv = document.querySelector('.maincontent.container')
    const childDiv = parentDiv.querySelector('.modal-overlay.modal-content')
    if (childDiv) {
      parentDiv.removeChild(childDiv)
    }

}
