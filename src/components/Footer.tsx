
function Footer() {
    const year : number = new Date().getFullYear();

    return (
      <footer>
          <span>TodoListSync All right reserved {year}</span>
      </footer>
    );
}

export default Footer;