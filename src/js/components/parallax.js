export function Parallax() {
  const nameSpaces = {
    wrapper: ".devices",
    layers: ".parallax-layer",
    deep: "data-parallax-deep",
  };

  const parallaxWrappers = document.querySelectorAll(nameSpaces.wrapper);

  Object.values(parallaxWrappers).map(wrapper => {
    window.addEventListener("mousemove", e => {
      const layers = wrapper.querySelectorAll(nameSpaces.layers);

      Object.values(layers).map(layer => {
        const deep = layer.getAttribute(nameSpaces.deep);
        const itemX = e.clientX / deep;
        const itemY = e.clientY / deep;

        layer.style.transform =
          "translateX(" + itemX + "%) translateY(calc(" + itemY + "%))";
      });
    });
  });
}
export default Parallax;
