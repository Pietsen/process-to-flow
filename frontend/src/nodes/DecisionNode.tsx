import { Handle, Position, type NodeProps } from '@xyflow/react';
import styles from './nodes.module.css';

type DecisionNodeData = {
  label: string;
  actor: string;
  color: string;
};

export function DecisionNode({ data }: NodeProps) {
  const nodeData = data as DecisionNodeData;

  return (
    <div className={styles.decisionWrapper}>
      <Handle type="target" position={Position.Top} />
      <div className={styles.decisionNode} style={{ backgroundColor: nodeData.color }}>
        <div className={styles.nodeTitle}>{nodeData.label}</div>
        <div className={styles.nodeMeta}>{nodeData.actor}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: '35%' }} />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: '65%' }} />
    </div>
  );
}
