
const CanonicalExpression = (props) =>
{
  return (
    <Switch fallback={
        <mrow>
          <CanonicalExpression tree={props.tree.left} />
          <mo>+</mo>
          <CanonicalExpression tree={props.tree.right} />
        </mrow>
      }>
      <Match when={props.tree.value === 1}>
        <mn>1</mn>
      </Match>
      <Match when={props.tree.value === 'x'}>
        <mi>x</mi>
      </Match>
      <Match when={props.tree.inverse}>
        <mfrac>
          <mn>1</mn>
          <CanonicalExpression tree={props.tree.inverse} />
        </mfrac>
      </Match>
    </Switch>
  )
}

export const Equation = (props) =>
{
  return (
    <math class="equation" display="block">
      <mrow>
        {/* <mi>x</mi>
        <mo>=</mo> */}
        <CanonicalExpression tree={props.tree} />
      </mrow>
    </math>
  );
}

