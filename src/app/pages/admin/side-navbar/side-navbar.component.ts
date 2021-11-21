import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ExampleFlatNode } from 'src/app/interfaces/example-flat-node';
import { SideNavList } from 'src/app/interfaces/SideNavlist';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */


const TREE_DATA: SideNavList[] = [
  {
    name: 'Products',
    link: 'Products',
    children: [
      {
        name: 'All products',
        link: 'all-products'
      },
      {
        name: 'Add a product',
        link: 'add-product'
      }
    ],
  }
];

/** Flat node with expandable and level information */


/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
})
export class SideNavbarComponent {
  private _transformer = (node: SideNavList, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      link: node.link,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}

