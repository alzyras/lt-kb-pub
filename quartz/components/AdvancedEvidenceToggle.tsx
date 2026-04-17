// @ts-ignore
import advancedEvidenceScript from "./scripts/advancedevidence.inline"
import styles from "./styles/advancedevidence.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const AdvancedEvidenceToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <button
      class={classNames(displayClass, "advanced-evidence-toggle")}
      aria-label="Rodyti arba slėpti išplėstus metaduomenis"
      title="Advanced metaduomenys"
      type="button"
    >
      <span class="advanced-evidence-toggle-label">Adv</span>
    </button>
  )
}

AdvancedEvidenceToggle.beforeDOMLoaded = advancedEvidenceScript
AdvancedEvidenceToggle.css = styles

export default (() => AdvancedEvidenceToggle) satisfies QuartzComponentConstructor
